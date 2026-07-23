// Void Response Generator — Natural Language Generation
// Template-based + Pattern composition + Context-aware responses

class ResponseGenerator {
  constructor(nlp, knowledgeBase, reasoningEngine) {
    this.nlp = nlp;
    this.kb = knowledgeBase;
    this.reasoning = reasoningEngine;
    this.personality = {
      name: 'Void',
      traits: ['helpful', 'knowledgeable', 'thoughtful', 'curious'],
      style: 'conversational',
      greeting: 'Hello! I\'m Void, your AI assistant. How can I help you today?',
      fallback: 'I\'m not sure I understand. Could you rephrase that?',
      farewell: 'Goodbye! It was great talking with you.'
    };
  }

  // ============================================
  // MAIN RESPONSE GENERATION
  // ============================================

  generate(input, context = {}) {
    const analysis = {
      intent: this.nlp.recognizeIntent(input),
      entities: this.nlp.extractEntities(input),
      sentiment: this.nlp.analyzeSentiment(input),
      keywords: this.nlp.extractKeywords(input)
    };

    // Get conversation context
    const convContext = context.conversation || {};
    const topic = context.topic || analysis.keywords[0]?.word;
    const previousTopic = convContext.previousTopic;

    // Route to appropriate handler
    const response = this._routeToHandler(analysis, context, convContext);

    return {
      text: response.text,
      type: response.type,
      confidence: response.confidence,
      analysis,
      suggestions: response.suggestions || []
    };
  }

  // ============================================
  // ROUTING
  // ============================================

  _routeToHandler(analysis, context, convContext) {
    const { intent, entities, sentiment, keywords } = analysis;
    const primaryIntent = intent.primary.intent;
    const allIntents = intent.all.map(i => i.intent);

    // Priority routing - check specific intents first
    if (allIntents.includes('greeting')) return this._handleGreeting(context);
    if (allIntents.includes('farewell')) return this._handleFarewell(context);
    if (allIntents.includes('identity')) return this._handleIdentity(context);
    if (allIntents.includes('capability')) return this._handleCapability(context);
    if (allIntents.includes('math')) return this._handleMath(analysis, context, convContext);
    if (allIntents.includes('code')) return this._handleCode(analysis, context, convContext);
    if (allIntents.includes('explanation') || allIntents.includes('definition')) {
      return this._handleExplanation(analysis, context, convContext);
    }
    if (allIntents.includes('comparison')) return this._handleComparison(analysis, context, convContext);
    if (allIntents.includes('list')) return this._handleList(analysis, context, convContext);
    if (allIntents.includes('advice')) return this._handleAdvice(analysis, context, convContext);
    if (allIntents.includes('problem')) return this._handleProblem(analysis, context, convContext);
    if (allIntents.includes('tutorial')) return this._handleTutorial(analysis, context, convContext);
    if (allIntents.includes('request') || allIntents.includes('command')) {
      return this._handleRequest(analysis, context, convContext);
    }
    if (allIntents.includes('opinion') || allIntents.includes('opinion_question')) {
      return this._handleOpinion(analysis, context, convContext);
    }

    // Default question handling
    if (intent.questionType !== 'open') {
      return this._handleQuestion(analysis, context, convContext);
    }
    if (primaryIntent === 'explanation' || primaryIntent === 'definition') {
      return this._handleExplanation(analysis, context, convContext);
    }
    if (primaryIntent === 'request' || primaryIntent === 'command') {
      return this._handleRequest(analysis, context, convContext);
    }
    if (primaryIntent === 'opinion' || primaryIntent === 'opinion_question') {
      return this._handleOpinion(analysis, context, convContext);
    }
    if (primaryIntent === 'comparison') return this._handleComparison(analysis, context, convContext);
    if (primaryIntent === 'list') return this._handleList(analysis, context, convContext);
    if (primaryIntent === 'advice') return this._handleAdvice(analysis, context, convContext);
    if (primaryIntent === 'problem') return this._handleProblem(analysis, context, convContext);
    if (primaryIntent === 'tutorial') return this._handleTutorial(analysis, context, convContext);
    if (primaryIntent === 'math') return this._handleMath(analysis, context, convContext);
    if (primaryIntent === 'code') return this._handleCode(analysis, context, convContext);
    if (primaryIntent === 'weather') return this._handleWeather(analysis, context, convContext);
    if (primaryIntent === 'time') return this._handleTime(analysis, context, convContext);

    // Default: statement
    return this._handleStatement(analysis, context, convContext);
  }

  // ============================================
  // HANDLERS
  // ============================================

  _handleGreeting(context) {
    const hour = new Date().getHours();
    let timeGreeting = 'Hello';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    const userName = context.user?.name || '';
    const namePart = userName ? `, ${userName}` : '';

    return {
      text: `${timeGreeting}${namePart}! I'm Void, your AI assistant. How can I help you today?`,
      type: 'greeting',
      confidence: 0.95,
      suggestions: ['Tell me about yourself', 'What can you do?', 'I need help with something']
    };
  }

  _handleFarewell(context) {
    const farewells = [
      'Goodbye! It was great talking with you. Come back anytime!',
      'See you later! Feel free to ask if you have more questions.',
      'Take care! I\'m here whenever you need help.',
      'Bye! Have a wonderful day!'
    ];
    return {
      text: farewells[Math.floor(Math.random() * farewells.length)],
      type: 'farewell',
      confidence: 0.95
    };
  }

  _handleIdentity(context) {
    return {
      text: `I'm Void, an AI assistant built with symbolic reasoning. I'm not a neural network — I use knowledge graphs, pattern matching, and logical inference to help you. I can answer questions, explain concepts, help with code, and have conversations on many topics. What would you like to know?`,
      type: 'identity',
      confidence: 0.95,
      suggestions: ['How do you work?', 'What can you do?', 'Tell me about AI']
    };
  }

  _handleCapability(context) {
    return {
      text: `I can help you with many things:\n\n• **Answer questions** about science, math, programming, history, and more\n• **Explain concepts** in simple or detailed terms\n• **Help with code** — I understand multiple programming languages\n• **Solve math problems** — arithmetic, algebra, and basic calculus\n• **Provide information** from my knowledge base\n• **Have conversations** on various topics\n• **Give advice** on problems and decisions\n\nJust ask me anything! What would you like help with?`,
      type: 'capability',
      confidence: 0.9,
      suggestions: ['Ask a math question', 'Explain a concept', 'Help with code']
    };
  }

  _handleQuestion(analysis, context, convContext) {
    const { intent, entities, keywords } = analysis;
    const questionType = intent.questionType;
    
    const stopWords = new Set(['what', 'who', 'when', 'where', 'why', 'how', 'is', 'are', 'was', 'were', 'can', 'could', 'would', 'should', 'do', 'does', 'did', 'the', 'a', 'an', 'tell', 'me', 'about', 'explain', 'describe', 'give', 'know', 'like', 'think', 'say', 'tell', 'help']);
    const topicKeywords = keywords.filter(k => !stopWords.has(k.word.toLowerCase()));
    
    // Try multi-word topics from knowledge base first
    let topic = null;
    const text = keywords.map(k => k.word).join(' ');
    for (const [name] of this.kb.concepts) {
      if (name.includes(' ') && text.includes(name.toLowerCase())) {
        topic = name;
        break;
      }
    }
    if (!topic) {
      for (const [name] of this.kb.facts) {
        if (name.includes(' ') && text.includes(name.toLowerCase())) {
          topic = name;
          break;
        }
      }
    }
    
    // Then try single keywords
    for (const kw of topicKeywords) {
      const word = kw.word.toLowerCase();
      if (this.kb.hasFact(word) || this.kb.getConcept(word)) {
        topic = kw.word;
        break;
      }
      for (const [name] of this.kb.facts) {
        if (name.toLowerCase() === word) {
          topic = name;
          break;
        }
      }
      if (topic) break;
      for (const [name] of this.kb.concepts) {
        if (name.toLowerCase() === word) {
          topic = name;
          break;
        }
      }
      if (topic) break;
    }

    // Search knowledge base for answer
    let answer = null;
    let confidence = 0;

    // Try to find direct fact from entities
    for (const entity of entities) {
      if (entity.type === 'PERSON' || entity.type === 'TOPIC') {
        const val = entity.value.toLowerCase();
        let facts = this.kb.getFact(val);
        if (!facts) {
          for (const [name, data] of this.kb.facts) {
            if (name.toLowerCase() === val) {
              facts = data;
              break;
            }
          }
        }
        if (facts) {
          answer = this._formatFacts(entity.value, facts);
          confidence = 0.8;
          break;
        }
      }
    }

    // Try concept search with topic
    if (!answer && topic) {
      const concepts = this.kb.searchConcepts(topic);
      if (concepts.length > 0) {
        answer = this._formatConcept(concepts[0]);
        confidence = 0.75;
      }
    }

    // Try inference
    if (!answer && topic) {
      const inferred = this.reasoning.infer(topic);
      if (Object.keys(inferred).length > 0) {
        answer = this._formatInferred(topic, inferred);
        confidence = 0.7;
      }
    }

    // Try explanation
    if (!answer && topic) {
      const explanation = this.reasoning.explain(topic);
      if (explanation.evidence.length > 0) {
        answer = this._formatExplanation(topic, explanation);
        confidence = 0.65;
      }
    }

    if (answer) {
      return {
        text: answer,
        type: 'answer',
        confidence,
        suggestions: this._generateFollowUp(topic, 'question')
      };
    }

    // Fallback based on question type
    return this._questionTypeFallback(questionType, topic);
  }

  _handleExplanation(analysis, context, convContext) {
    const stopWords = new Set(['what', 'who', 'when', 'where', 'why', 'how', 'is', 'are', 'was', 'were', 'can', 'could', 'would', 'should', 'do', 'does', 'did', 'the', 'a', 'an', 'tell', 'me', 'about', 'explain', 'describe', 'give', 'know', 'like', 'think', 'say', 'tell', 'help']);
    const topicKeywords = analysis.keywords.filter(k => !stopWords.has(k.word.toLowerCase()));
    
    // Try multi-word topics from knowledge base
    let topic = null;
    const text = analysis.keywords.map(k => k.word).join(' ');
    // Check all multi-word concepts in KB
    for (const [name] of this.kb.concepts) {
      if (name.includes(' ') && text.includes(name.toLowerCase())) {
        topic = name;
        break;
      }
    }
    // Also check fact names
    if (!topic) {
      for (const [name] of this.kb.facts) {
        if (name.includes(' ') && text.includes(name.toLowerCase())) {
          topic = name;
          break;
        }
      }
    }
    
    // Try to find topic from keywords
    if (!topic) {
      for (const kw of topicKeywords) {
        const word = kw.word.toLowerCase();
        // Check if this word is in knowledge base
        if (this.kb.hasFact(word) || this.kb.getConcept(word)) {
          topic = kw.word;
          break;
        }
        // Check case-insensitive
        for (const [name] of this.kb.facts) {
          if (name.toLowerCase() === word) {
            topic = name;
            break;
          }
        }
        if (topic) break;
        for (const [name] of this.kb.concepts) {
          if (name.toLowerCase() === word) {
            topic = name;
            break;
          }
        }
        if (topic) break;
      }
    }
    
    // If no topic from keywords, try entities
    if (!topic) {
      const entity = analysis.entities.find(e => e.type === 'TOPIC' || e.type === 'PERSON');
      if (entity) topic = entity.value;
    }

    if (!topic) {
      return {
        text: 'What would you like me to explain? Please specify a topic or concept.',
        type: 'clarification',
        confidence: 0.5
      };
    }

    // Try exact match first
    let concept = this.kb.getConcept(topic);
    let facts = this.kb.getFact(topic);
    
    // Try case-insensitive match
    if (!concept && !facts) {
      const lowerTopic = topic.toLowerCase();
      for (const [name, data] of this.kb.concepts) {
        if (name.toLowerCase() === lowerTopic) {
          concept = data;
          topic = name;
          break;
        }
      }
    }
    if (!facts) {
      const lowerTopic = topic.toLowerCase();
      for (const [name, data] of this.kb.facts) {
        if (name.toLowerCase() === lowerTopic) {
          facts = data;
          topic = name;
          break;
        }
      }
    }
    
    // Try partial match (e.g., "einstein" matches "albert einstein")
    if (!facts) {
      const lowerTopic = topic.toLowerCase();
      for (const [name, data] of this.kb.facts) {
        if (name.toLowerCase().includes(lowerTopic) || lowerTopic.includes(name.toLowerCase())) {
          facts = data;
          topic = name;
          break;
        }
      }
    }
    if (!concept) {
      const lowerTopic = topic.toLowerCase();
      for (const [name, data] of this.kb.concepts) {
        if (name.toLowerCase().includes(lowerTopic) || lowerTopic.includes(name.toLowerCase())) {
          concept = data;
          topic = name;
          break;
        }
      }
    }

    if (concept) {
      return {
        text: this._formatDetailedExplanation(topic, concept),
        type: 'explanation',
        confidence: 0.85,
        suggestions: this._generateFollowUp(topic, 'explanation')
      };
    }

    if (facts) {
      return {
        text: this._formatFactsDetailed(topic, facts),
        type: 'explanation',
        confidence: 0.8,
        suggestions: this._generateFollowUp(topic, 'explanation')
      };
    }

    return {
      text: `I don't have detailed information about "${topic}" in my knowledge base yet. Could you tell me more about it, or would you like to know about something else?`,
      type: 'unknown',
      confidence: 0.3
    };
  }

  _handleRequest(analysis, context, convContext) {
    const { intent, entities, keywords } = analysis;

    // Check for specific requests
    const requestWords = keywords.map(k => k.word);

    if (requestWords.some(w => ['help', 'assist', 'support'].includes(w))) {
      return {
        text: 'I\'m here to help! What do you need assistance with? You can ask me questions, request explanations, or just have a conversation.',
        type: 'offer_help',
        confidence: 0.8
      };
    }

    if (requestWords.some(w => ['search', 'find', 'look'].includes(w))) {
      const query = entities.find(e => e.type === 'TOPIC')?.value || requestWords[0];
      return {
        text: `I'll search for information about "${query}". Let me check my knowledge base...`,
        type: 'search',
        confidence: 0.7
      };
    }

    return {
      text: 'I understand you need help. Could you be more specific about what you\'d like me to do?',
      type: 'clarification',
      confidence: 0.5
    };
  }

  _handleOpinion(analysis, context, convContext) {
    const topic = analysis.keywords[0]?.word;

    if (!topic) {
      return {
        text: 'What would you like my opinion on? I can share perspectives on many topics.',
        type: 'clarification',
        confidence: 0.5
      };
    }

    const concept = this.kb.getConcept(topic);
    if (concept) {
      return {
        text: `Based on my knowledge, ${topic} is ${concept.definition}. It's an interesting topic with many facets. What aspect would you like to discuss?`,
        type: 'opinion',
        confidence: 0.7
      };
    }

    return {
      text: `I don't have strong opinions on "${topic}" specifically, but I'd be happy to discuss it with you. What are your thoughts?`,
      type: 'opinion',
      confidence: 0.5
    };
  }

  _handleComparison(analysis, context, convContext) {
    const text = analysis.keywords.map(k => k.word).join(' ');
    const vsMatch = text.match(/(\w+)\s+vs\s+(\w+)/i) || text.match(/(\w+)\s+versus\s+(\w+)/i) || text.match(/compare\s+(\w+)\s+(?:and|with)\s+(\w+)/i);
    
    let a, b;
    if (vsMatch) {
      a = { value: vsMatch[1].toLowerCase() };
      b = { value: vsMatch[2].toLowerCase() };
    } else {
      const entities = analysis.entities.filter(e => e.type === 'TOPIC' || e.type === 'PERSON');
      if (entities.length < 2) {
        return {
          text: 'What two things would you like me to compare? Please specify both subjects.',
          type: 'clarification',
          confidence: 0.5
        };
      }
      a = entities[0];
      b = entities[1];
    }

    // Try case-insensitive lookup
    let factsA = this.kb.getFact(a.value) || {};
    let factsB = this.kb.getFact(b.value) || {};
    
    if (Object.keys(factsA).length === 0) {
      for (const [name, data] of this.kb.facts) {
        if (name.toLowerCase() === a.value.toLowerCase()) {
          factsA = data;
          a.value = name;
          break;
        }
      }
    }
    if (Object.keys(factsB).length === 0) {
      for (const [name, data] of this.kb.facts) {
        if (name.toLowerCase() === b.value.toLowerCase()) {
          factsB = data;
          b.value = name;
          break;
        }
      }
    }

    const sharedKeys = Object.keys(factsA).filter(k => k in factsB);
    const onlyInA = Object.keys(factsA).filter(k => !(k in factsB));
    const onlyInB = Object.keys(factsB).filter(k => !(k in factsA));

    let response = `Comparing ${a.value} and ${b.value}:\n\n`;

    if (sharedKeys.length > 0) {
      response += `**Similarities:**\n`;
      for (const key of sharedKeys) {
        if (factsA[key] === factsB[key]) {
          response += `• Both have ${key}: ${factsA[key]}\n`;
        }
      }
      response += '\n';
    }

    if (onlyInA.length > 0) {
      response += `**Only ${a.value}:**\n`;
      for (const key of onlyInA) {
        response += `• ${key}: ${factsA[key]}\n`;
      }
      response += '\n';
    }

    if (onlyInB.length > 0) {
      response += `**Only ${b.value}:**\n`;
      for (const key of onlyInB) {
        response += `• ${key}: ${factsB[key]}\n`;
      }
    }

    return {
      text: response,
      type: 'comparison',
      confidence: 0.75,
      suggestions: [`Tell me more about ${a.value}`, `Tell me more about ${b.value}`]
    };
  }

  _handleList(analysis, context, convContext) {
    const topic = analysis.keywords[0]?.word;

    if (!topic) {
      return {
        text: 'What would you like me to list? Please specify a category or topic.',
        type: 'clarification',
        confidence: 0.5
      };
    }

    // Search for related entities
    const related = this.kb.getRelatedEntities(topic);
    if (related.length > 0) {
      const list = related.slice(0, 10).map(r => `• ${r}`).join('\n');
      return {
        text: `Here are some things related to ${topic}:\n\n${list}`,
        type: 'list',
        confidence: 0.7,
        suggestions: related.slice(0, 3).map(r => `Tell me about ${r}`)
      };
    }

    return {
      text: `I don't have a list of items for "${topic}" in my knowledge base. Could you be more specific?`,
      type: 'unknown',
      confidence: 0.3
    };
  }

  _handleAdvice(analysis, context, convContext) {
    const topic = analysis.keywords[0]?.word;

    if (!topic) {
      return {
        text: 'What do you need advice on? Please describe your situation or question.',
        type: 'clarification',
        confidence: 0.5
      };
    }

    const concept = this.kb.getConcept(topic);
    if (concept) {
      return {
        text: `Regarding ${topic}: ${concept.definition}\n\nFor specific advice, I'd need more details about your situation. Could you tell me more?`,
        type: 'advice',
        confidence: 0.6
      };
    }

    return {
      text: `I can try to help with ${topic}. Could you describe your specific situation or question in more detail?`,
      type: 'advice',
      confidence: 0.5
    };
  }

  _handleProblem(analysis, context, convContext) {
    const topic = analysis.keywords[0]?.word;

    return {
      text: `I understand you're having a problem${topic ? ` with ${topic}` : ''}. Let me help you think through this.\n\nCould you provide more details about:\n1. What exactly is happening?\n2. What have you tried so far?\n3. What is the expected behavior?\n\nThis will help me give you a better solution.`,
      type: 'problem_solving',
      confidence: 0.7,
      suggestions: ['I\'ll provide more details', 'Let me rephrase the problem']
    };
  }

  _handleTutorial(analysis, context, convContext) {
    const topic = analysis.keywords[0]?.word;

    if (!topic) {
      return {
        text: 'What would you like to learn? Please specify a topic or skill.',
        type: 'clarification',
        confidence: 0.5
      };
    }

    const concept = this.kb.getConcept(topic);
    if (concept) {
      return {
        text: `Let me help you understand ${topic}.\n\n**What is it?**\n${concept.definition}\n\n**Related concepts:**\n${concept.related.map(r => `• ${r}`).join('\n')}\n\n**Examples:**\n${concept.examples.map(e => `• ${e}`).join('\n')}\n\nWould you like me to go deeper into any of these aspects?`,
        type: 'tutorial',
        confidence: 0.8,
        suggestions: concept.related.slice(0, 3).map(r => `Tell me about ${r}`)
      };
    }

    return {
      text: `I'd be happy to teach you about ${topic}. However, I don't have detailed tutorial content for this topic yet. Could you tell me what specific aspect you'd like to learn?`,
      type: 'tutorial',
      confidence: 0.5
    };
  }

  _handleMath(analysis, context, convContext) {
    const text = analysis.keywords.map(k => k.word).join(' ');
    const numbers = text.match(/\d+/g);

    if (numbers && numbers.length >= 2) {
      // Simple arithmetic detection
      const ops = ['+', '-', '*', '/'];
      for (const op of ops) {
        if (text.includes(op)) {
          const [a, b] = numbers.map(Number);
          let result;
          switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = b !== 0 ? a / b : 'undefined (division by zero)'; break;
          }
          return {
            text: `${a} ${op} ${b} = ${result}`,
            type: 'math',
            confidence: 0.9
          };
        }
      }
    }

    return {
      text: 'I can help with math! Please provide a specific equation or calculation, like "What is 2 + 3?" or "Calculate 10 * 5".',
      type: 'math_help',
      confidence: 0.6
    };
  }

  _handleCode(analysis, context, convContext) {
    return {
      text: `I can help with programming! I understand concepts like:\n\n• **Variables and data types**\n• **Functions and methods**\n• **Control flow** (if/else, loops)\n• **Data structures** (arrays, objects, maps)\n• **Algorithms** (sorting, searching)\n• **Programming languages** (JavaScript, Python, C++, Rust, and more)\n\nWhat specific coding help do you need?`,
      type: 'code_help',
      confidence: 0.8,
      suggestions: ['Explain a concept', 'Help with a bug', 'Show an example']
    };
  }

  _handleWeather(analysis, context, convContext) {
    return {
      text: 'I don\'t have access to real-time weather data, but I can explain weather concepts! Would you like to know about meteorology, climate patterns, or something specific?',
      type: 'weather',
      confidence: 0.5
    };
  }

  _handleTime(analysis, context, convContext) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const dateStr = now.toLocaleDateString();
    return {
      text: `It's currently ${timeStr} on ${dateStr}. Is there something specific about time or dates you'd like to know?`,
      type: 'time',
      confidence: 0.9
    };
  }

  _handleStatement(analysis, context, convContext) {
    const { sentiment, keywords } = analysis;
    const topic = keywords[0]?.word;

    if (sentiment.label === 'positive') {
      return {
        text: `That's great to hear! ${topic ? `I'm glad you're positive about ${topic}.` : 'Is there anything else I can help you with?'}`,
        type: 'acknowledgment',
        confidence: 0.6
      };
    }

    if (sentiment.label === 'negative') {
      return {
        text: `I understand. ${topic ? `Is there something about ${topic} that's concerning you?` : 'Would you like to talk about it?'}`,
        type: 'empathy',
        confidence: 0.6
      };
    }

    return {
      text: `I see. ${topic ? `Tell me more about ${topic}.` : 'Is there something specific you\'d like to discuss?'}`,
      type: 'engagement',
      confidence: 0.5,
      suggestions: ['Ask a question', 'Explain a concept', 'Have a conversation']
    };
  }

  // ============================================
  // HELPERS
  // ============================================

  _formatFacts(entity, facts) {
    const entries = Object.entries(facts)
      .filter(([k]) => !k.startsWith('_'))
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`);
    return `${entity} is characterized by: ${entries.join(', ')}.`;
  }

  _formatFactsDetailed(entity, facts) {
    let response = `**${entity}**\n\n`;
    const entries = Object.entries(facts).filter(([k]) => !k.startsWith('_'));
    for (const [key, value] of entries) {
      response += `• **${key.replace(/_/g, ' ')}:** ${value}\n`;
    }
    return response;
  }

  _formatConcept(concept) {
    return `${concept.definition}\n\nRelated concepts: ${concept.related.join(', ')}.`;
  }

  _formatDetailedExplanation(topic, concept) {
    let response = `**${topic}**\n\n`;
    response += `${concept.definition}\n\n`;

    if (concept.related.length > 0) {
      response += `**Related concepts:**\n`;
      for (const rel of concept.related) {
        response += `• ${rel}\n`;
      }
      response += '\n';
    }

    if (concept.examples.length > 0) {
      response += `**Examples:**\n`;
      for (const ex of concept.examples) {
        response += `• ${ex}\n`;
      }
    }

    return response;
  }

  _formatInferred(topic, inferred) {
    let response = `Based on what I know about ${topic}:\n\n`;
    for (const [key, value] of Object.entries(inferred)) {
      if (!key.startsWith('_')) {
        response += `• ${key.replace(/_/g, ' ')}: ${value}\n`;
      }
    }
    return response;
  }

  _formatExplanation(topic, explanation) {
    let response = `Here's what I can tell you about ${topic}:\n\n`;

    if (explanation.evidence.length > 0) {
      response += `**Evidence:**\n`;
      for (const ev of explanation.evidence.slice(0, 5)) {
        if (ev.type === 'relation') {
          response += `• ${ev.predicate} → ${ev.object}\n`;
        } else {
          response += `• ${JSON.stringify(ev)}\n`;
        }
      }
    }

    if (explanation.reasoning.length > 0) {
      response += `\n**Reasoning:**\n`;
      for (const r of explanation.reasoning.slice(0, 3)) {
        response += `• ${r.conclusion} (confidence: ${(r.confidence * 100).toFixed(0)}%)\n`;
      }
    }

    return response;
  }

  _questionTypeFallback(type, topic) {
    const fallbacks = {
      what: `I don't have specific information about "${topic || 'that'}" yet. Could you provide more context?`,
      who: `I don't have information about who you're asking about. Could you provide more details?`,
      where: `I don't have location data. Could you be more specific about what you're looking for?`,
      when: `I don't have specific time information for that. Could you provide more context?`,
      why: `That's an interesting question. I don't have a definitive answer yet, but I'd be happy to explore this with you.`,
      how: `I don't have step-by-step instructions for that yet. Could you describe what you're trying to accomplish?`,
      yesno: `I'm not sure about that specific yes/no question. Could you rephrase it?`,
      ability: `I'm not certain about my capabilities in that specific area. Could you tell me more about what you need?`,
      advice: `I'd need more context to give you good advice. Could you describe your situation?`
    };

    return {
      text: fallbacks[type] || this.personality.fallback,
      type: 'fallback',
      confidence: 0.3
    };
  }

  _generateFollowUp(topic, type) {
    if (!topic) return [];

    const suggestions = [];

    if (type === 'question') {
      suggestions.push(`Tell me more about ${topic}`);
      suggestions.push(`What are the applications of ${topic}?`);
      suggestions.push(`How does ${topic} relate to other concepts?`);
    } else if (type === 'explanation') {
      suggestions.push(`Give me an example of ${topic}`);
      suggestions.push(`What are the key aspects of ${topic}?`);
      suggestions.push(`Compare ${topic} with something similar`);
    }

    return suggestions.slice(0, 3);
  }
}

export { ResponseGenerator };
