// Void Reasoning Engine — Symbolic Reasoning
// Deduction, Induction, Abduction, Analogical Reasoning

class ReasoningEngine {
  constructor(knowledgeBase) {
    this.kb = knowledgeBase;
    this.inferenceCache = new Map();
  }

  // ============================================
  // DEDUCTION — General to Specific
  // ============================================

  deduce(premises) {
    const conclusions = [];

    for (const premise of premises) {
      // Modus Ponens: If P→Q and P, then Q
      if (premise.type === 'implies') {
        const { antecedent, consequent } = premise;
        if (this._evaluate(antecedent)) {
          conclusions.push({
            type: 'deduction',
            method: 'modus_ponens',
            conclusion: consequent,
            confidence: premise.confidence || 1.0,
            premises: [premise]
          });
        }
      }

      // Syllogism: All A are B, x is A, therefore x is B
      if (premise.type === 'syllogism') {
        const { major, minor } = premise;
        if (this._evaluate(major) && this._evaluate(minor)) {
          conclusions.push({
            type: 'deduction',
            method: 'syllogism',
            conclusion: premise.conclusion,
            confidence: premise.confidence || 0.9,
            premises: [major, minor]
          });
        }
      }

      // Chain: A→B, B→C, therefore A→C
      if (premise.type === 'chain') {
        const chain = premise.chain;
        let valid = true;
        for (let i = 0; i < chain.length - 1; i++) {
          if (!this._evaluate(chain[i])) {
            valid = false;
            break;
          }
        }
        if (valid) {
          conclusions.push({
            type: 'deduction',
            method: 'hypothetical_syllogism',
            conclusion: premise.conclusion,
            confidence: premise.confidence || 0.85,
            premises: chain
          });
        }
      }
    }

    return conclusions;
  }

  // ============================================
  // INDUCTION — Specific to General
  // ============================================

  induce(observations) {
    if (observations.length === 0) return [];

    const patterns = [];
    const frequency = {};

    // Count attribute frequencies
    for (const obs of observations) {
      for (const [key, value] of Object.entries(obs)) {
        if (key.startsWith('_')) continue;
        const patternKey = `${key}=${value}`;
        frequency[patternKey] = (frequency[patternKey] || 0) + 1;
      }
    }

    // Find patterns that appear in >50% of observations
    const threshold = observations.length * 0.5;
    for (const [pattern, count] of Object.entries(frequency)) {
      if (count >= threshold) {
        const [key, value] = pattern.split('=');
        patterns.push({
          type: 'induction',
          method: 'frequency',
          pattern: { attribute: key, value, frequency: count, total: observations.length },
          confidence: count / observations.length,
          observations
        });
      }
    }

    // Find correlations
    const attributes = Object.keys(frequency).map(p => p.split('=')[0]);
    const uniqueAttrs = [...new Set(attributes)];

    for (let i = 0; i < uniqueAttrs.length; i++) {
      for (let j = i + 1; j < uniqueAttrs.length; j++) {
        const correlation = this._calculateCorrelation(observations, uniqueAttrs[i], uniqueAttrs[j]);
        if (correlation > 0.7) {
          patterns.push({
            type: 'induction',
            method: 'correlation',
            pattern: { attr1: uniqueAttrs[i], attr2: uniqueAttrs[j], correlation },
            confidence: correlation,
            observations
          });
        }
      }
    }

    return patterns;
  }

  // ============================================
  // ABDUCTION — Best Explanation
  // ============================================

  abduce(observation, hypotheses) {
    const explanations = [];

    for (const hypothesis of hypotheses) {
      // Check if hypothesis explains observation
      const explains = this._checkExplanation(observation, hypothesis);

      // Check simplicity (Occam's razor)
      const complexity = this._measureComplexity(hypothesis);

      // Check consistency with existing knowledge
      const consistency = this._checkConsistency(hypothesis);

      // Score = explanation quality × consistency / complexity
      const score = (explains * consistency) / (complexity + 1);

      explanations.push({
        type: 'abduction',
        method: 'inference_to_best_explanation',
        hypothesis,
        score,
        explains,
        consistency,
        complexity
      });
    }

    // Sort by score
    explanations.sort((a, b) => b.score - a.score);

    return explanations;
  }

  // ============================================
  // ANALOGICAL REASONING
  // ============================================

  analogize(source, target) {
    const analogies = [];

    // Find structural similarities
    const sourceRelations = this.kb.getRelations(source);
    const targetRelations = this.kb.getRelations(target);

    const matchingPredicates = sourceRelations
      .filter(sr => targetRelations.some(tr => tr.predicate === sr.predicate))
      .map(sr => sr.predicate);

    if (matchingPredicates.length > 0) {
      const confidence = matchingPredicates.length / Math.max(sourceRelations.length, targetRelations.length, 1);
      analogies.push({
        type: 'analogy',
        method: 'structural',
        source,
        target,
        sharedPredicates: matchingPredicates,
        confidence
      });
    }

    // Find attribute similarities
    const sourceFacts = this.kb.getFact(source) || {};
    const targetFacts = this.kb.getFact(target) || {};

    const sharedAttributes = Object.keys(sourceFacts)
      .filter(key => key in targetFacts && sourceFacts[key] === targetFacts[key]);

    if (sharedAttributes.length > 0) {
      const confidence = sharedAttributes.length / Math.max(Object.keys(sourceFacts).length, Object.keys(targetFacts).length, 1);
      analogies.push({
        type: 'analogy',
        method: 'attribute',
        source,
        target,
        sharedAttributes,
        confidence
      });
    }

    return analogies;
  }

  // ============================================
  // EXPLANATION GENERATION
  // ============================================

  explain(conclusion) {
    const explanation = {
      conclusion,
      reasoning: [],
      evidence: [],
      confidence: 0
    };

    // Find facts that support conclusion
    const facts = this.kb.queryFacts({ entity: conclusion });
    if (facts.length > 0) {
      explanation.evidence.push(...facts);
      explanation.confidence += 0.3;
    }

    // Find rules that lead to conclusion
    const ruleConclusions = this.kb.evaluateRules({ conclusion });
    for (const rc of ruleConclusions) {
      explanation.reasoning.push({
        type: 'rule',
        ruleId: rc.ruleId,
        conclusion: rc.conclusion,
        confidence: rc.confidence
      });
      explanation.confidence += rc.confidence * 0.2;
    }

    // Find relations
    const relations = this.kb.getRelations(conclusion);
    for (const rel of relations) {
      explanation.evidence.push({
        type: 'relation',
        predicate: rel.predicate,
        object: rel.object
      });
      explanation.confidence += 0.1;
    }

    explanation.confidence = Math.min(explanation.confidence, 1.0);

    return explanation;
  }

  // ============================================
  // INFERENCE
  // ============================================

  infer(entity) {
    return this.kb.infer(entity);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  _evaluate(statement) {
    if (typeof statement === 'boolean') return statement;
    if (typeof statement === 'string') {
      return this.kb.hasFact(statement);
    }
    if (typeof statement === 'object') {
      if (statement.has) {
        return statement.has.every(item => this.kb.hasFact(item));
      }
      if (statement.equals) {
        const [a, b] = statement.equals;
        return a === b;
      }
      if (statement.greater) {
        const [a, b] = statement.greater;
        return a > b;
      }
    }
    return false;
  }

  _calculateCorrelation(observations, attr1, attr2) {
    const pairs = observations
      .filter(obs => attr1 in obs && attr2 in obs)
      .map(obs => [obs[attr1], obs[attr2]]);

    if (pairs.length < 2) return 0;

    // Simple correlation: how often do values match?
    let matches = 0;
    for (const [v1, v2] of pairs) {
      if (v1 === v2) matches++;
    }

    return matches / pairs.length;
  }

  _checkExplanation(observation, hypothesis) {
    // Check if hypothesis would cause observation
    if (hypothesis.type === 'cause') {
      return this.kb.getRelations(hypothesis.cause)
        .some(r => r.predicate === 'causes' && r.object === observation);
    }
    if (hypothesis.type === 'rule') {
      return this._evaluate(hypothesis.condition);
    }
    return 0.5; // Unknown
  }

  _measureComplexity(hypothesis) {
    if (typeof hypothesis === 'string') return 1;
    if (typeof hypothesis === 'object') {
      return Object.keys(hypothesis).length;
    }
    return 1;
  }

  _checkConsistency(hypothesis) {
    // Check if hypothesis contradicts existing knowledge
    const relations = this.kb.getRelations(hypothesis.entity || '');
    for (const rel of relations) {
      if (rel.predicate === 'contradicts' && rel.object === hypothesis.claim) {
        return 0;
      }
    }
    return 1;
  }
}

export { ReasoningEngine };
