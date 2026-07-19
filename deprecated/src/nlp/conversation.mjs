// Void Conversation Manager — Multi-turn Context & Memory
// Manages conversation state, context window, and session memory

class ConversationManager {
  constructor(maxHistory = 50, maxContextTokens = 4000) {
    this.sessions = new Map();
    this.maxHistory = maxHistory;
    this.maxContextTokens = maxContextTokens;
    this.userProfiles = new Map();
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  createSession(userId = 'default') {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session = {
      id: sessionId,
      userId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      messageCount: 0,
      history: [],
      context: {
        currentTopic: null,
        previousTopic: null,
        entities: new Map(),
        sentiment: { score: 0, label: 'neutral' },
        intent: null,
        topics: [],
        userState: {
          mood: 'neutral',
          engagement: 'normal',
          satisfaction: 0
        }
      },
      memory: {
        facts: new Map(),           // Things learned about user
        preferences: new Map(),     // User preferences
        importantMessages: [],      // Key messages to remember
        topicHistory: []            // Topics discussed
      }
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
    }
    return session;
  }

  // ============================================
  // MESSAGE MANAGEMENT
  // ============================================

  addMessage(sessionId, role, content, metadata = {}) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role, // 'user' or 'assistant'
      content,
      timestamp: Date.now(),
      metadata: {
        intent: metadata.intent || null,
        entities: metadata.entities || [],
        sentiment: metadata.sentiment || null,
        keywords: metadata.keywords || [],
        ...metadata
      }
    };

    session.history.push(message);
    session.messageCount++;
    session.lastActivity = Date.now();

    // Trim history if needed
    if (session.history.length > this.maxHistory) {
      session.history = session.history.slice(-this.maxHistory);
    }

    // Update context
    this._updateContext(session, message);

    return message;
  }

  getHistory(sessionId, lastN = null) {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    if (lastN) {
      return session.history.slice(-lastN);
    }
    return session.history;
  }

  // ============================================
  // CONTEXT MANAGEMENT
  // ============================================

  _updateContext(session, message) {
    const ctx = session.context;

    if (message.role === 'user') {
      // Update topic
      const keywords = message.metadata.keywords || [];
      if (keywords.length > 0) {
        const newTopic = keywords[0].word;
        if (newTopic !== ctx.currentTopic) {
          ctx.previousTopic = ctx.currentTopic;
          ctx.currentTopic = newTopic;
          if (!ctx.topics.includes(newTopic)) {
            ctx.topics.push(newTopic);
          }
          session.memory.topicHistory.push({
            topic: newTopic,
            timestamp: Date.now()
          });
        }
      }

      // Update entities
      const entities = message.metadata.entities || [];
      for (const entity of entities) {
        ctx.entities.set(entity.value, {
          type: entity.type,
          confidence: entity.confidence,
          lastSeen: Date.now()
        });
      }

      // Update sentiment
      if (message.metadata.sentiment) {
        ctx.sentiment = message.metadata.sentiment;
        // Update user mood based on sentiment
        if (message.metadata.sentiment.label === 'positive') {
          ctx.userState.mood = 'positive';
          ctx.userState.satisfaction = Math.min(1, ctx.userState.satisfaction + 0.1);
        } else if (message.metadata.sentiment.label === 'negative') {
          ctx.userState.mood = 'negative';
          ctx.userState.satisfaction = Math.max(0, ctx.userState.satisfaction - 0.1);
        }
      }

      // Update intent
      if (message.metadata.intent) {
        ctx.intent = message.metadata.intent;
      }

      // Track engagement
      const timeSinceLastMessage = message.timestamp - (session.history.length > 1 ?
        session.history[session.history.length - 2].timestamp : session.startTime);
      if (timeSinceLastMessage < 5000) {
        ctx.userState.engagement = 'high';
      } else if (timeSinceLastMessage > 60000) {
        ctx.userState.engagement = 'low';
      } else {
        ctx.userState.engagement = 'normal';
      }
    }

    // Learn from conversation
    this._learnFromMessage(session, message);
  }

  _learnFromMessage(session, message) {
    if (message.role === 'user') {
      const content = message.content.toLowerCase();

      // Learn user name if mentioned
      const nameMatch = content.match(/(?:my name is|i'm|i am)\s+(\w+)/i);
      if (nameMatch) {
        session.memory.facts.set('userName', nameMatch[1]);
      }

      // Learn preferences
      if (content.includes('i like') || content.includes('i prefer')) {
        const preference = content.replace(/.*(?:i like|i prefer)\s+/i, '').split('.')[0];
        session.memory.preferences.set(preference, Date.now());
      }

      // Track important messages (questions, requests)
      if (message.metadata.intent?.primary?.intent === 'question' ||
          message.metadata.intent?.primary?.intent === 'request') {
        session.memory.importantMessages.push({
          content: message.content,
          timestamp: Date.now(),
          intent: message.metadata.intent.primary.intent
        });
      }
    }
  }

  // ============================================
  // CONTEXT WINDOW
  // ============================================

  buildContextWindow(sessionId, maxLength = null) {
    const session = this.sessions.get(sessionId);
    if (!session) return '';

    const max = maxLength || this.maxContextTokens;
    const ctx = session.context;
    const history = session.history;

    // Build context string
    let context = '';

    // Add current state
    if (ctx.currentTopic) {
      context += `Current topic: ${ctx.currentTopic}\n`;
    }
    if (ctx.previousTopic) {
      context += `Previous topic: ${ctx.previousTopic}\n`;
    }
    if (ctx.userState.mood !== 'neutral') {
      context += `User mood: ${ctx.userState.mood}\n`;
    }

    // Add recent history
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      const content = msg.content.substring(0, 200);
      context += `${role}: ${content}\n`;
    }

    // Add learned facts
    if (session.memory.facts.size > 0) {
      context += '\nKnown facts about user:\n';
      for (const [key, value] of session.memory.facts) {
        context += `• ${key}: ${value}\n`;
      }
    }

    // Trim to max length
    if (context.length > max) {
      context = context.substring(context.length - max);
    }

    return context;
  }

  // ============================================
  // USER PROFILES
  // ============================================

  getUserProfile(userId) {
    return this.userProfiles.get(userId) || null;
  }

  updateUserProfile(userId, data) {
    const existing = this.userProfiles.get(userId) || {};
    this.userProfiles.set(userId, {
      ...existing,
      ...data,
      lastUpdated: Date.now()
    });
    return true;
  }

  // ============================================
  // ANALYTICS
  // ============================================

  getSessionStats(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const userMessages = session.history.filter(m => m.role === 'user');
    const assistantMessages = session.history.filter(m => m.role === 'assistant');

    const avgSentiment = userMessages.reduce((sum, m) =>
      sum + (m.metadata.sentiment?.score || 0), 0) / (userMessages.length || 1);

    const topics = [...new Set(session.context.topics)];

    return {
      duration: Date.now() - session.startTime,
      messageCount: session.messageCount,
      userMessageCount: userMessages.length,
      assistantMessageCount: assistantMessages.length,
      topicsDiscussed: topics,
      averageSentiment: avgSentiment,
      currentMood: session.context.userState.mood,
      engagement: session.context.userState.engagement,
      satisfaction: session.context.userState.satisfaction,
      factsLearned: session.memory.facts.size,
      preferencesLearned: session.memory.preferences.size
    };
  }

  getAllSessions() {
    return [...this.sessions.values()].map(s => ({
      id: s.id,
      userId: s.userId,
      startTime: s.startTime,
      lastActivity: s.lastActivity,
      messageCount: s.messageCount,
      currentTopic: s.context.currentTopic
    }));
  }
}

export { ConversationManager };
