// Void Knowledge Base — Symbolic Knowledge Storage & Inference
// Facts, Relations, Rules, and Reasoning Chains

import { CONCEPTS, FACTS_MAP, RELATIONS_MAP } from './knowledge-data.mjs';

class KnowledgeBase {
  constructor() {
    this.facts = new Map();           // entity -> attributes
    this.relations = new Map();       // (entity, relation, entity)
    this.rules = [];                  // IF-THEN rules
    this.concepts = new Map();        // concept -> definition
    this.contexts = new Map();        // context -> facts
    this._seedKnowledge();
    this._seedFromDataModule();
  }

  // ============================================
  // FACT MANAGEMENT
  // ============================================

  addFact(entity, attributes) {
    const existing = this.facts.get(entity) || {};
    this.facts.set(entity, { ...existing, ...attributes, _lastUpdated: Date.now() });
    return true;
  }

  getFact(entity) {
    return this.facts.get(entity) || null;
  }

  hasFact(entity) {
    return this.facts.has(entity);
  }

  queryFacts(pattern) {
    const results = [];
    for (const [entity, attrs] of this.facts) {
      if (this._matchesPattern(entity, attrs, pattern)) {
        results.push({ entity, ...attrs });
      }
    }
    return results;
  }

  // ============================================
  // RELATION MANAGEMENT
  // ============================================

  addRelation(subject, predicate, object) {
    const key = `${subject}|${predicate}`;
    if (!this.relations.has(key)) {
      this.relations.set(key, []);
    }
    this.relations.get(key).push({ object, timestamp: Date.now() });
    return true;
  }

  getRelations(subject, predicate) {
    if (predicate) {
      const key = `${subject}|${predicate}`;
      return (this.relations.get(key) || []).map(r => r.object);
    }
    // Get all relations for subject
    const results = [];
    for (const [key, values] of this.relations) {
      if (key.startsWith(subject + '|')) {
        const pred = key.split('|')[1];
        for (const v of values) {
          results.push({ predicate: pred, object: v.object });
        }
      }
    }
    return results;
  }

  getRelatedEntities(entity) {
    const related = new Set();
    for (const [key, values] of this.relations) {
      if (key.startsWith(entity + '|')) {
        for (const v of values) related.add(v.object);
      }
      if (key.endsWith('|' + entity)) {
        related.add(key.split('|')[0]);
      }
    }
    return [...related];
  }

  // ============================================
  // RULE MANAGEMENT
  // ============================================

  addRule(condition, conclusion, confidence = 1.0) {
    this.rules.push({ condition, conclusion, confidence, id: this.rules.length });
    return this.rules.length - 1;
  }

  evaluateRules(context = {}) {
    const conclusions = [];
    for (const rule of this.rules) {
      if (this._evaluateCondition(rule.condition, context)) {
        conclusions.push({
          conclusion: rule.conclusion,
          confidence: rule.confidence,
          ruleId: rule.id
        });
      }
    }
    return conclusions;
  }

  // ============================================
  // CONCEPT MANAGEMENT
  // ============================================

  addConcept(name, definition, relatedConcepts = [], examples = []) {
    this.concepts.set(name, {
      definition,
      related: relatedConcepts,
      examples,
      createdAt: Date.now()
    });
    return true;
  }

  getConcept(name) {
    return this.concepts.get(name) || null;
  }

  searchConcepts(query) {
    const lower = query.toLowerCase();
    const results = [];
    for (const [name, data] of this.concepts) {
      if (name.toLowerCase().includes(lower) ||
          data.definition.toLowerCase().includes(lower)) {
        results.push({ name, ...data });
      }
    }
    return results;
  }

  // ============================================
  // INFERENCE ENGINE
  // ============================================

  infer(entity) {
    const inferred = {};
    const facts = this.getFact(entity);
    if (facts) Object.assign(inferred, facts);

    // Get all relations
    const relations = this.getRelations(entity);
    for (const rel of relations) {
      inferred[rel.predicate] = rel.object;
    }

    // Apply rules
    const ruleConclusions = this.evaluateRules({ entity, ...inferred });
    for (const conclusion of ruleConclusions) {
      if (conclusion.confidence > 0.5) {
        inferred[`_inferred_${conclusion.ruleId}`] = conclusion.conclusion;
      }
    }

    return inferred;
  }

  findPath(start, end, maxDepth = 4) {
    const visited = new Set([start]);
    const queue = [[start, [start]]];

    while (queue.length > 0) {
      const [current, path] = queue.shift();
      if (path.length > maxDepth) continue;

      const related = this.getRelatedEntities(current);
      for (const next of related) {
        if (next === end) return [...path, next];
        if (!visited.has(next)) {
          visited.add(next);
          queue.push([next, [...path, next]]);
        }
      }
    }

    return null;
  }

  // ============================================
  // CONTEXT MANAGEMENT
  // ============================================

  setContext(contextId, data) {
    this.contexts.set(contextId, data);
  }

  getContext(contextId) {
    return this.contexts.get(contextId) || null;
  }

  // ============================================
  // SEED KNOWLEDGE
  // ============================================

  _seedKnowledge() {
    // ===== COMPREHENSIVE CONCEPTS =====
    // Core academic
    this.addConcept('programming', 'The process of creating instructions for computers to execute', ['computer science', 'software', 'algorithms'], ['Python', 'JavaScript', 'C++']);
    this.addConcept('artificial intelligence', 'Simulation of human intelligence by machines', ['machine learning', 'deep learning', 'neural networks'], ['ChatGPT', 'image recognition', 'self-driving cars']);
    this.addConcept('mathematics', 'The study of numbers, shapes, and patterns', ['algebra', 'geometry', 'calculus'], ['equations', 'proofs', 'theorems']);
    this.addConcept('science', 'Systematic study of the natural world', ['physics', 'chemistry', 'biology'], ['experiments', 'hypotheses', 'theories']);
    this.addConcept('philosophy', 'Study of fundamental questions about existence, knowledge, and ethics', ['metaphysics', 'epistemology', 'ethics'], ['consciousness', 'truth', 'morality']);
    this.addConcept('history', 'Study of past events', ['civilization', 'wars', 'revolutions'], ['ancient Rome', 'World War II', 'Renaissance']);
    this.addConcept('economics', 'Study of production, distribution, and consumption of goods', ['microeconomics', 'macroeconomics', 'finance'], ['supply and demand', 'inflation', 'GDP']);
    this.addConcept('psychology', 'Study of mind and behavior', ['cognitive', 'behavioral', 'clinical'], ['memory', 'perception', 'emotions']);
    this.addConcept('physics', 'Study of matter, energy, and their interactions', ['mechanics', 'thermodynamics', 'quantum'], ['gravity', 'electromagnetism', 'relativity']);
    this.addConcept('biology', 'Study of living organisms', ['genetics', 'ecology', 'anatomy'], ['DNA', 'cells', 'evolution']);
    this.addConcept('chemistry', 'Study of substances and their reactions', ['organic', 'inorganic', 'biochemistry'], ['atoms', 'molecules', 'reactions']);
    this.addConcept('computer science', 'Study of computation and information', ['algorithms', 'data structures', 'networks'], ['programming', 'databases', 'AI']);
    this.addConcept('language', 'System of communication using symbols', ['grammar', 'semantics', 'syntax'], ['English', 'Spanish', 'Mandarin']);
    this.addConcept('music', 'Art of organizing sound in time', ['rhythm', 'melody', 'harmony'], ['classical', 'jazz', 'rock']);
    this.addConcept('art', 'Creative expression of ideas and emotions', ['painting', 'sculpture', 'photography'], ['Renaissance', 'impressionism', 'abstract']);
    this.addConcept('literature', 'Written works considered to have artistic merit', ['poetry', 'fiction', 'drama'], ['Shakespeare', 'Dickens', 'Austen']);
    this.addConcept('geography', 'Study of Earth\'s surface and human activity', ['physical geography', 'human geography', 'cartography'], ['mountains', 'rivers', 'countries']);
    this.addConcept('astronomy', 'Study of celestial objects', ['planets', 'stars', 'galaxies'], ['solar system', 'black holes', 'nebulae']);
    this.addConcept('medicine', 'Science of diagnosing and treating disease', ['anatomy', 'pharmacology', 'surgery'], ['doctors', 'hospitals', 'medications']);
    this.addConcept('engineering', 'Application of scientific principles to design and build', ['mechanical', 'electrical', 'civil'], ['bridges', 'machines', 'circuits']);

    // Technology concepts
    this.addConcept('machine learning', 'AI technique that enables systems to learn from data', ['deep learning', 'supervised learning', 'neural networks'], ['classification', 'regression', 'clustering']);
    this.addConcept('deep learning', 'ML using neural networks with many layers', ['neural networks', 'CNNs', 'transformers'], ['image recognition', 'NLP', 'generative AI']);
    this.addConcept('blockchain', 'Distributed ledger technology for secure transactions', ['cryptocurrency', 'decentralization', 'smart contracts'], ['Bitcoin', 'Ethereum', 'DeFi']);
    this.addConcept('quantum computing', 'Computing using quantum mechanical phenomena', ['qubits', 'superposition', 'entanglement'], ['IBM Quantum', 'Google Sycamore']);
    this.addConcept('cloud computing', 'Delivery of computing services over the internet', ['AWS', 'Azure', 'GCP'], ['IaaS', 'PaaS', 'SaaS']);
    this.addConcept('cybersecurity', 'Protection of computer systems from threats', ['encryption', 'firewalls', 'penetration testing'], ['hacking', 'malware', 'phishing']);
    this.addConcept('robotics', 'Design and use of robots', ['automation', 'sensors', 'actuators'], ['industrial robots', 'humanoids', 'drones']);
    this.addConcept('internet', 'Global system of interconnected computer networks', ['WWW', 'TCP/IP', 'DNS'], ['websites', 'email', 'streaming']);
    this.addConcept('data science', 'Extraction of knowledge from data', ['statistics', 'visualization', 'machine learning'], ['big data', 'analytics', 'prediction']);
    this.addConcept('software engineering', 'Systematic development of software', ['agile', 'DevOps', 'testing'], ['requirements', 'design', 'deployment']);
    this.addConcept('operating system', 'Software managing computer hardware and software', ['Linux', 'Windows', 'macOS'], ['kernel', 'filesystem', 'processes']);
    this.addConcept('database', 'Organized collection of structured data', ['SQL', 'NoSQL', 'relational'], ['MySQL', 'PostgreSQL', 'MongoDB']);
    this.addConcept('networking', 'Communication between computing devices', ['protocols', 'routing', 'TCP/IP'], ['LAN', 'WAN', 'VPN']);
    this.addConcept('algorithms', 'Step-by-step procedures for calculations', ['sorting', 'searching', 'optimization'], ['quicksort', 'Dijkstra', 'binary search']);
    this.addConcept('data structures', 'Organizing and storing data efficiently', ['arrays', 'trees', 'graphs'], ['linked lists', 'hash tables', 'heaps']);
    this.addConcept('web development', 'Building websites and web applications', ['HTML', 'CSS', 'JavaScript'], ['frontend', 'backend', 'fullstack']);
    this.addConcept('mobile development', 'Creating applications for mobile devices', ['iOS', 'Android', 'React Native'], ['Swift', 'Kotlin', 'Flutter']);
    this.addConcept('game development', 'Creating video games', ['Unity', 'Unreal', 'Godot'], ['2D', '3D', 'VR/AR']);
    this.addConcept('devops', 'Combining development and IT operations', ['CI/CD', 'containers', 'Kubernetes'], ['Docker', 'Jenkins', 'Terraform']);
    this.addConcept('open source', 'Software with publicly available source code', ['Linux', 'Git', 'MIT license'], ['collaboration', 'community', 'free software']);
    this.addConcept('API', 'Application Programming Interface for software communication', ['REST', 'GraphQL', 'gRPC'], ['endpoints', 'authentication', 'rate limiting']);
    this.addConcept('microservices', 'Architectural style structuring apps as services', ['Docker', 'Kubernetes', 'service mesh'], ['decomposition', 'scalability', 'resilience']);
    this.addConcept('containerization', 'Packaging software with its dependencies', ['Docker', 'Podman', 'LXC'], ['isolation', 'portability', 'reproducibility']);

    // Science concepts
    this.addConcept('quantum mechanics', 'Physics of subatomic particles', ['wave-particle duality', 'uncertainty principle', 'quantum entanglement'], ['Schrödinger', 'Heisenberg', 'Feynman']);
    this.addConcept('relativity', 'Einstein\'s theory of space and time', ['special relativity', 'general relativity', 'E=mc²'], ['time dilation', 'black holes', 'gravitational waves']);
    this.addConcept('evolution', 'Process of change in living organisms over generations', ['natural selection', 'genetic mutation', 'speciation'], ['Darwin', 'adaptation', 'fossil record']);
    this.addConcept('ecology', 'Study of interactions between organisms and environment', ['ecosystems', 'biodiversity', 'conservation'], ['food chains', 'symbiosis', 'climate change']);
    this.addConcept('genetics', 'Study of genes and heredity', ['DNA', 'mutations', 'inheritance'], ['Mendel', 'CRISPR', 'genetic engineering']);
    this.addConcept('thermodynamics', 'Study of heat and energy', ['entropy', 'heat engines', 'laws of thermodynamics'], ['Carnot', 'Joule', 'Kelvin']);
    this.addConcept('electromagnetism', 'Study of electric and magnetic fields', ['Maxwell\'s equations', 'light', 'electromagnetic spectrum'], ['Faraday', 'Hertz', 'wireless communication']);
    this.addConcept('organic chemistry', 'Study of carbon-containing compounds', ['hydrocarbons', 'functional groups', 'reaction mechanisms'], ['pharmaceuticals', 'polymers', 'biochemistry']);
    this.addConcept('nuclear physics', 'Study of atomic nuclei', ['radioactive decay', 'fission', 'fusion'], ['nuclear energy', 'isotopes', 'particle accelerators']);
    this.addConcept('astrophysics', 'Study of physics of celestial objects', ['stellar evolution', 'galaxies', 'cosmology'], ['Hubble', 'neutron stars', 'dark matter']);
    this.addConcept('paleontology', 'Study of fossils and prehistoric life', ['fossils', 'geological time', 'extinction events'], ['dinosaurs', 'evolutionary biology', 'plate tectonics']);
    this.addConcept('neuroscience', 'Study of the nervous system', ['brain', 'neurons', 'consciousness'], ['neuroplasticity', 'cognition', 'brain imaging']);
    this.addConcept('materials science', 'Study of properties and applications of materials', ['metals', 'polymers', 'composites'], ['nanomaterials', 'superconductors', 'semiconductors']);
    this.addConcept('atmospheric science', 'Study of Earth\'s atmosphere', ['weather', 'climate', 'meteorology'], ['greenhouse effect', 'ozone layer', 'climate change']);
    this.addConcept('oceanography', 'Study of the ocean', ['marine biology', 'ocean currents', 'tides'], ['deep sea', 'coral reefs', 'marine ecosystems']);

    // Mathematics concepts
    this.addConcept('algebra', 'Study of mathematical symbols and rules for manipulating them', ['variables', 'equations', 'polynomials'], ['linear algebra', 'abstract algebra', 'Boolean algebra']);
    this.addConcept('geometry', 'Study of shapes, sizes, and properties of space', ['Euclidean', 'non-Euclidean', 'topology'], ['triangles', 'circles', 'polygons']);
    this.addConcept('calculus', 'Study of continuous change', ['derivatives', 'integrals', 'limits'], ['differential calculus', 'integral calculus', 'multivariable calculus']);
    this.addConcept('statistics', 'Study of data collection and analysis', ['probability', 'distributions', 'hypothesis testing'], ['mean', 'median', 'standard deviation']);
    this.addConcept('number theory', 'Study of properties of integers', ['prime numbers', 'modular arithmetic', 'Fibonacci'], ['Fermat', 'Euler', 'Gauss']);
    this.addConcept('graph theory', 'Study of mathematical structures modeling relationships', ['nodes', 'edges', 'paths'], ['Euler paths', 'Hamiltonian cycles', 'coloring']);
    this.addConcept('combinatorics', 'Study of counting and arrangement', ['permutations', 'combinations', 'binomial theorem'], ['Pascal\'s triangle', 'inclusion-exclusion']);
    this.addConcept('topology', 'Study of properties preserved under continuous transformations', ['manifolds', 'knots', 'homotopy'], ['Euler characteristic', 'Brouwer fixed-point theorem']);
    this.addConcept('linear algebra', 'Study of vectors and matrices', ['vectors', 'matrices', 'eigenvalues'], ['vector spaces', 'transformations', 'determinants']);
    this.addConcept('differential equations', 'Equations involving derivatives', ['ODEs', 'PDEs', 'systems of equations'], ['Laplace transform', 'Fourier series']);
    this.addConcept('logic', 'Study of valid reasoning and argumentation', ['propositional logic', 'predicate logic', 'proof theory'], ['deduction', 'induction', 'abduction']);
    this.addConcept('set theory', 'Study of mathematical sets', ['sets', 'relations', 'functions'], ['Venn diagrams', 'cardinality', 'axiom of choice']);
    this.addConcept('probability', 'Study of random events and likelihood', ['random variables', 'distributions', 'Bayes\' theorem'], ['gambling', 'risk assessment', 'prediction']);
    this.addConcept('discrete mathematics', 'Study of discrete structures', ['graph theory', 'combinatorics', 'logic'], ['algorithms', 'cryptography', 'networks']);
    this.addConcept('applied mathematics', 'Mathematics used in practical applications', ['engineering', 'finance', 'physics'], ['modeling', 'simulation', 'optimization']);

    // Humanities
    this.addConcept('linguistics', 'Study of language', ['phonetics', 'syntax', 'semantics'], ['Chomsky', 'Sapir-Whorf', 'computational linguistics']);
    this.addConcept('anthropology', 'Study of human societies and cultures', ['cultural anthropology', 'archaeology', 'biological anthropology'], ['ethnography', 'cultural relativism']);
    this.addConcept('sociology', 'Study of society and social behavior', ['social structures', 'inequality', 'deviance'], ['Durkheim', 'Weber', 'Marx']);
    this.addConcept('political science', 'Study of government and politics', ['democracy', 'international relations', 'public policy'], ['elections', 'parties', 'constitutions']);
    this.addConcept('archaeology', 'Study of human history through artifacts', ['excavation', 'dating methods', 'cultural remains'], ['ancient civilizations', 'artifacts', 'pottery']);
    this.addConcept('theology', 'Study of religious belief and practice', ['comparative religion', 'ethics', 'spiritual experience'], ['Bible', 'Quran', 'Buddhism']);
    this.addConcept('ethics', 'Study of moral principles', ['deontology', 'consequentialism', 'virtue ethics'], ['Kant', 'Mill', 'Aristotle']);
    this.addConcept('aesthetics', 'Study of beauty and taste', ['art criticism', 'sublime', 'design'], ['Ruskin', 'Kant', 'Dewey']);

    // Practical skills
    this.addConcept('cooking', 'Practice of preparing food', ['baking', 'grilling', 'sauces'], ['French cuisine', 'molecular gastronomy', 'meal prep']);
    this.addConcept('gardening', 'Practice of growing plants', ['horticulture', 'landscaping', 'sustainable agriculture'], ['vegetables', 'flowers', 'trees']);
    this.addConcept('writing', 'Practice of composing text', ['fiction', 'non-fiction', 'poetry'], ['creative writing', 'technical writing', 'journalism']);
    this.addConcept('photography', 'Practice of creating images using light', ['composition', 'lighting', 'editing'], ['portrait', 'landscape', 'street photography']);
    this.addConcept('fishing', 'Practice of catching fish', ['angling', 'fly fishing', 'commercial fishing'], ['freshwater', 'saltwater', 'fly fishing']);
    this.addConcept('woodworking', 'Practice of making things from wood', ['joinery', 'carving', 'turning'], ['furniture', 'cabinetry', 'decorative']);
    this.addConcept('pottery', 'Practice of making objects from clay', ['wheel throwing', 'hand building', 'glazing'], ['ceramics', 'stoneware', 'porcelain']);
    this.addConcept('knitting', 'Practice of creating fabric from yarn', ['stitches', 'patterns', 'techniques'], ['sweaters', 'socks', 'blankets']);
    this.addConcept('chess', 'Board game of strategy', ['tactics', 'strategy', 'endgames'], ['Fischer', 'Kasparov', 'AI chess']);
    this.addConcept('meditation', 'Practice of focused attention for mental clarity', ['mindfulness', 'transcendental', 'zen'], ['stress reduction', 'concentration', 'self-awareness']);
    this.addConcept('yoga', 'Practice of physical postures and breathing', ['hatha', 'vinyasa', 'ashtanga'], ['flexibility', 'strength', 'relaxation']);
    this.addConcept('martial arts', 'Practice of combat techniques', ['karate', 'judo', 'kung fu'], ['self-defense', 'discipline', 'competition']);
    this.addConcept('dancing', 'Practice of rhythmic movement to music', ['ballet', 'salsa', 'hip hop'], ['choreography', 'social dancing', 'competition']);
    this.addConcept('swimming', 'Practice of propelling oneself through water', ['freestyle', 'backstroke', 'butterfly'], ['competition', 'recreation', 'survival']);
    this.addConcept('hiking', 'Practice of walking in nature', ['trail hiking', 'mountaineering', 'backpacking'], ['national parks', 'fitness', 'exploration']);

    // ===== COMPREHENSIVE FACTS =====
    // Solar system
    this.addFact('earth', { type: 'planet', mass: '5.972 × 10^24 kg', diameter: '12,742 km', age: '4.54 billion years', orbits: 'sun', has_moon: true, gravity: '9.81 m/s²', rotation_period: '23.93 hours', distance_from_sun: '149.6 million km' });
    this.addFact('sun', { type: 'star', mass: '1.989 × 10^30 kg', temperature: '5,778 K', age: '4.6 billion years', type_detail: 'G-type main-sequence', luminosity: '3.828 × 10^26 W', composition: '73% hydrogen, 25% helium' });
    this.addFact('moon', { type: 'natural satellite', diameter: '3,474 km', distance_from_earth: '384,400 km', orbits: 'earth', age: '4.51 billion years', surface_temperature: '-173°C to 127°C', gravity: '1.62 m/s²' });
    this.addFact('mars', { type: 'planet', diameter: '6,779 km', age: '4.6 billion years', orbits: 'sun', has_moons: true, gravity: '3.72 m/s²', atmosphere: '95% carbon dioxide' });
    this.addFact('jupiter', { type: 'planet', diameter: '139,820 km', age: '4.6 billion years', orbits: 'sun', has_moons: true, gravity: '24.79 m/s²', notable: 'Great Red Spot storm' });
    this.addFact('saturn', { type: 'planet', diameter: '116,460 km', age: '4.6 billion years', orbits: 'sun', has_moons: true, gravity: '10.44 m/s²', notable: 'prominent ring system' });
    this.addFact('mercury', { type: 'planet', diameter: '4,879 km', orbits: 'sun', gravity: '3.7 m/s²', surface_temperature: '-173°C to 427°C', day_length: '59 Earth days' });
    this.addFact('venus', { type: 'planet', diameter: '12,104 km', orbits: 'sun', gravity: '8.87 m/s²', atmosphere: '96% carbon dioxide', surface_temperature: '462°C' });
    this.addFact('neptune', { type: 'planet', diameter: '49,244 km', orbits: 'sun', has_moons: true, gravity: '11.15 m/s²', wind_speed: 'up to 2,100 km/h' });
    this.addFact('pluto', { type: 'dwarf planet', diameter: '2,377 km', orbits: 'sun', gravity: '0.62 m/s²', reclassified: 2006, has_moons: true });
    this.addFact('milky way', { type: 'galaxy', diameter: '100,000 light-years', age: '13.61 billion years', stars: '100-400 billion', type: 'barred spiral' });

    // Chemistry elements
    this.addFact('water', { type: 'compound', formula: 'H2O', boiling_point: '100°C', freezing_point: '0°C', states: ['solid', 'liquid', 'gas'], density: '1 g/cm³', ph: 7.0 });
    this.addFact('oxygen', { type: 'element', symbol: 'O', atomic_number: 8, group: 16, phase: 'gas', atomic_mass: '16.00', electronegativity: 3.44 });
    this.addFact('carbon', { type: 'element', symbol: 'C', atomic_number: 6, group: 14, phase: 'solid', atomic_mass: '12.01', allotropes: ['diamond', 'graphite', 'fullerene'] });
    this.addFact('hydrogen', { type: 'element', symbol: 'H', atomic_number: 1, group: 1, phase: 'gas', atomic_mass: '1.008', abundance: '75% of baryonic mass' });
    this.addFact('nitrogen', { type: 'element', symbol: 'N', atomic_number: 7, group: 15, phase: 'gas', atomic_mass: '14.01', abundance: '78% of atmosphere' });
    this.addFact('iron', { type: 'element', symbol: 'Fe', atomic_number: 26, phase: 'solid', atomic_mass: '55.85', uses: ['construction', 'tools', 'steel'] });
    this.addFact('gold', { type: 'element', symbol: 'Au', atomic_number: 79, phase: 'solid', atomic_mass: '196.97', uses: ['jewelry', 'electronics', 'currency'] });
    this.addFact('silver', { type: 'element', symbol: 'Ag', atomic_number: 47, phase: 'solid', atomic_mass: '107.87', uses: ['jewelry', 'electronics', 'photography'] });
    this.addFact('copper', { type: 'element', symbol: 'Cu', atomic_number: 29, phase: 'solid', atomic_mass: '63.55', uses: ['wiring', 'plumbing', 'electronics'] });
    this.addFact('aluminum', { type: 'element', symbol: 'Al', atomic_number: 13, phase: 'solid', atomic_mass: '26.98', uses: ['packaging', 'construction', 'aerospace'] });
    this.addFact('silicon', { type: 'element', symbol: 'Si', atomic_number: 14, phase: 'solid', atomic_mass: '28.09', uses: ['semiconductors', 'computer chips', 'solar cells'] });
    this.addFact('helium', { type: 'element', symbol: 'He', atomic_number: 2, group: 18, phase: 'gas', atomic_mass: '4.003', uses: ['balloons', 'MRI machines', 'cryogenics'] });
    this.addFact('carbon dioxide', { type: 'compound', formula: 'CO2', boiling_point: '-78.5°C', uses: ['photosynthesis', 'carbonation', 'fire extinguishers'], ph: 5.6 });
    this.addFact('sodium chloride', { type: 'compound', formula: 'NaCl', melting_point: '801°C', uses: ['seasoning', 'preservation', 'industrial'], common_name: 'table salt' });
    this.addFact('glucose', { type: 'compound', formula: 'C6H12O6', uses: ['energy source', 'metabolism', 'blood sugar'], common_name: 'blood sugar' });

    // Programming languages
    this.addFact('javascript', { type: 'programming language', paradigm: 'multi-paradigm', typing: 'dynamic', year_created: 1995, creator: 'Brendan Eich', uses: ['web development', 'server-side', 'mobile apps'], frameworks: ['React', 'Vue', 'Angular'] });
    this.addFact('python', { type: 'programming language', paradigm: 'multi-paradigm', typing: 'dynamic', year_created: 1991, creator: 'Guido van Rossum', uses: ['data science', 'AI', 'web development'], frameworks: ['Django', 'Flask', 'FastAPI'] });
    this.addFact('c++', { type: 'programming language', paradigm: 'multi-paradigm', typing: 'static', year_created: 1983, creator: 'Bjarne Stroustrup', uses: ['systems programming', 'games', 'embedded'], performance: 'high' });
    this.addFact('rust', { type: 'programming language', paradigm: 'multi-paradigm', typing: 'static', year_created: 2010, creator: 'Graydon Hoare', uses: ['systems programming', 'WebAssembly', 'embedded'], safety: 'memory safe' });
    this.addFact('java', { type: 'programming language', paradigm: 'object-oriented', typing: 'static', year_created: 1995, creator: 'James Gosling', uses: ['enterprise', 'Android', 'web'], philosophy: 'write once run anywhere' });
    this.addFact('go', { type: 'programming language', paradigm: 'compiled', typing: 'static', year_created: 2009, creator: 'Rob Pike', uses: ['cloud computing', 'microservices', 'CLI'], philosophy: 'simplicity and concurrency' });
    this.addFact('swift', { type: 'programming language', paradigm: 'multi-paradigm', typing: 'static', year_created: 2014, creator: 'Apple', uses: ['iOS/macOS apps', 'server-side'], safety: 'memory safe' });
    this.addFact('kotlin', { type: 'programming language', paradigm: 'multi-paradigm', typing: 'static', year_created: 2011, creator: 'JetBrains', uses: ['Android', 'server-side', 'cross-platform'], interop: 'Java compatible' });
    this.addFact('typescript', { type: 'programming language', paradigm: 'multi-paradigm', typing: 'static', year_created: 2012, creator: 'Microsoft', uses: ['web development', 'large-scale apps'], base: 'JavaScript superset' });
    this.addFact('ruby', { type: 'programming language', paradigm: 'object-oriented', typing: 'dynamic', year_created: 1995, creator: 'Yukihiro Matsumoto', uses: ['web development', 'scripting'], frameworks: ['Rails', 'Sinatra'] });
    this.addFact('php', { type: 'programming language', paradigm: 'imperative', typing: 'dynamic', year_created: 1995, creator: 'Rasmus Lerdorf', uses: ['web development', 'CMS'], frameworks: ['Laravel', 'WordPress'] });
    this.addFact('scala', { type: 'programming language', paradigm: 'multi-paradigm', typing: 'static', year_created: 2003, creator: 'Martin Odersky', uses: ['big data', 'distributed systems'], combines: 'OOP and functional' });
    this.addFact('haskell', { type: 'programming language', paradigm: 'functional', typing: 'static', year_created: 1990, creator: 'Haskell Committee', uses: ['academia', 'compilers', 'research'], purity: 'purely functional' });
    this.addFact('nebulara', { type: 'programming language', paradigm: 'AI-native', typing: 'dynamic', year_created: 2026, creator: 'CODURRA Labs', uses: ['AI', 'multi-language FFI', 'symbolic reasoning'], philosophy: 'structural resonance' });

    // Famous people
    this.addFact('albert einstein', { type: 'person', profession: 'physicist', famous_for: ['theory of relativity', 'E=mc²', 'photoelectric effect'], born: '1879', died: '1955', nationality: 'German/American' });
    this.addFact('isaac newton', { type: 'person', profession: 'physicist/mathematician', famous_for: ['laws of motion', 'universal gravitation', 'calculus'], born: '1643', died: '1727', nationality: 'English' });
    this.addFact('marie curie', { type: 'person', profession: 'physicist/chemist', famous_for: ['radioactivity', 'first Nobel Prize winner', 'discovery of polonium and radium'], born: '1867', died: '1934', nationality: 'Polish/French' });
    this.addFact('charles darwin', { type: 'person', profession: 'naturalist', famous_for: ['theory of evolution', 'natural selection', 'On the Origin of Species'], born: '1809', died: '1882', nationality: 'English' });
    this.addFact('leonardo da vinci', { type: 'person', profession: 'polymath', famous_for: ['Mona Lisa', 'flying machines', 'anatomical studies'], born: '1452', died: '1519', nationality: 'Italian' });
    this.addFact('william shakespeare', { type: 'person', profession: 'playwright/poet', famous_for: ['Hamlet', 'Romeo and Juliet', 'Sonnet 18'], born: '1564', died: '1616', nationality: 'English' });
    this.addFact('nikola tesla', { type: 'person', profession: 'inventor', famous_for: ['alternating current', 'tesla coil', 'radio'], born: '1856', died: '1943', nationality: 'Serbian/American' });
    this.addFact('ada lovelace', { type: 'person', profession: 'mathematician', famous_for: ['first computer programmer', 'Babbage\'s Analytical Engine'], born: '1815', died: '1852', nationality: 'English' });
    this.addFact('alan turing', { type: 'person', profession: 'mathematician/computer scientist', famous_for: ['Turing machine', 'Enigma code breaking', 'artificial intelligence'], born: '1912', died: '1954', nationality: 'English' });
    this.addFact('grace hopper', { type: 'person', profession: 'computer scientist', famous_for: ['COBOL', 'first compiler', 'debugging'], born: '1906', died: '1992', nationality: 'American' });
    this.addFact('steve jobs', { type: 'person', profession: 'entrepreneur/inventor', famous_for: ['Apple', 'iPhone', 'Macintosh'], born: '1955', died: '2011', nationality: 'American' });
    this.addFact('bill gates', { type: 'person', profession: 'entrepreneur', famous_for: ['Microsoft', 'Windows', 'philanthropy'], born: '1955', alive: true, nationality: 'American' });
    this.addFact('linus torvalds', { type: 'person', profession: 'programmer', famous_for: ['Linux kernel', 'Git'], born: '1969', alive: true, nationality: 'Finnish/American' });
    this.addFact('tim berners-lee', { type: 'person', profession: 'computer scientist', famous_for: ['World Wide Web', 'HTML', 'HTTP'], born: '1955', alive: true, nationality: 'English' });

    // Countries and geography
    this.addFact('united states', { type: 'country', capital: 'Washington D.C.', population: '331 million', area: '9.834 million km²', continent: 'North America', languages: ['English'] });
    this.addFact('china', { type: 'country', capital: 'Beijing', population: '1.4 billion', area: '9.597 million km²', continent: 'Asia', languages: ['Mandarin'] });
    this.addFact('india', { type: 'country', capital: 'New Delhi', population: '1.4 billion', area: '3.287 million km²', continent: 'Asia', languages: ['Hindi', 'English'] });
    this.addFact('japan', { type: 'country', capital: 'Tokyo', population: '125 million', area: '377,975 km²', continent: 'Asia', languages: ['Japanese'] });
    this.addFact('germany', { type: 'country', capital: 'Berlin', population: '83 million', area: '357,022 km²', continent: 'Europe', languages: ['German'] });
    this.addFact('united kingdom', { type: 'country', capital: 'London', population: '67 million', area: '242,495 km²', continent: 'Europe', languages: ['English'] });
    this.addFact('france', { type: 'country', capital: 'Paris', population: '67 million', area: '643,801 km²', continent: 'Europe', languages: ['French'] });
    this.addFact('brazil', { type: 'country', capital: 'Brasilia', population: '214 million', area: '8.516 million km²', continent: 'South America', languages: ['Portuguese'] });
    this.addFact('australia', { type: 'country', capital: 'Canberra', population: '26 million', area: '7.692 million km²', continent: 'Oceania', languages: ['English'] });
    this.addFact('canada', { type: 'country', capital: 'Ottawa', population: '38 million', area: '9.985 million km²', continent: 'North America', languages: ['English', 'French'] });

    // Foods
    this.addFact('apple', { type: 'food', category: 'fruit', calories: '52 per 100g', nutrients: ['fiber', 'vitamin C', 'potassium'], varieties: ['Fuji', 'Gala', 'Granny Smith'] });
    this.addFact('banana', { type: 'food', category: 'fruit', calories: '89 per 100g', nutrients: ['potassium', 'vitamin B6', 'vitamin C'], origin: 'Southeast Asia' });
    this.addFact('chicken', { type: 'food', category: 'poultry', calories: '165 per 100g', nutrients: ['protein', 'B vitamins'], preparations: ['grilled', 'fried', 'baked'] });
    this.addFact('rice', { type: 'food', category: 'grain', calories: '130 per 100g', nutrients: ['carbohydrates'], varieties: ['white', 'brown', 'jasmine'], origin: 'Asia' });
    this.addFact('bread', { type: 'food', category: 'grain', calories: '265 per 100g', nutrients: ['carbohydrates', 'fiber'], varieties: ['white', 'whole wheat', 'sourdough'] });
    this.addFact('pizza', { type: 'food', category: 'fast food', calories: '266 per 100g', origin: 'Italy', ingredients: ['dough', 'tomato sauce', 'cheese'], popular_varieties: ['Margherita', 'pepperoni'] });
    this.addFact('sushi', { type: 'food', category: 'Japanese cuisine', calories: '143 per 100g', origin: 'Japan', ingredients: ['rice', 'fish', 'seaweed'], varieties: ['nigiri', 'maki', 'sashimi'] });

    // Animals
    this.addFact('dog', { type: 'animal', class: 'mammal', scientific_name: 'Canis lupus familiaris', lifespan: '10-13 years', diet: 'omnivore', traits: ['loyal', 'social', 'trainable'], breeds: ['Labrador', 'German Shepherd', 'Bulldog'] });
    this.addFact('cat', { type: 'animal', class: 'mammal', scientific_name: 'Felis catus', lifespan: '12-18 years', diet: 'carnivore', traits: ['independent', 'agile', 'curious'], breeds: ['Persian', 'Siamese', 'Maine Coon'] });
    this.addFact('eagle', { type: 'animal', class: 'bird', scientific_name: 'Aquila', lifespan: '20-30 years', diet: 'carnivore', traits: ['powerful', 'keen vision', 'fast'], wingspan: 'up to 2.3 meters' });
    this.addFact('dolphin', { type: 'animal', class: 'mammal', scientific_name: 'Delphinidae', lifespan: '40-50 years', diet: 'carnivore', traits: ['intelligent', 'social', 'playful'], habitat: 'ocean' });
    this.addFact('elephant', { type: 'animal', class: 'mammal', scientific_name: 'Loxodonta', lifespan: '60-70 years', diet: 'herbivore', traits: ['intelligent', 'social', 'memory'], largest: 'land animal' });
    this.addFact('penguin', { type: 'animal', class: 'bird', scientific_name: 'Spheniscidae', lifespan: '15-20 years', diet: 'carnivore', traits: ['flightless', 'social', 'cold-adapted'], habitat: 'Southern Hemisphere' });
    this.addFact('shark', { type: 'animal', class: 'fish', scientific_name: 'Selachimorpha', lifespan: '20-30 years', diet: 'carnivore', traits: ['predatory', 'ancient', 'diverse'], species: 'over 500' });
    this.addFact('butterfly', { type: 'animal', class: 'insect', scientific_name: 'Lepidoptera', lifespan: '2-4 weeks', diet: 'nectar', traits: ['colorful', 'metamorphosis', 'pollinator'], stages: ['egg', 'larva', 'pupa', 'adult'] });
    this.addFact('lion', { type: 'animal', class: 'mammal', scientific_name: 'Panthera leo', lifespan: '10-14 years', diet: 'carnivore', traits: ['social', 'territorial', 'powerful'], habitat: 'Africa', title: 'King of the Jungle' });

    // Historical events
    this.addFact('world war ii', { type: 'event', years: '1939-1945', participants: '30+ countries', casualties: '70-85 million', outcome: 'Allied victory', causes: ['Nazi expansion', 'treaty of versailles'], significance: 'deadliest conflict in history' });
    this.addFact('french revolution', { type: 'event', years: '1789-1799', location: 'France', causes: ['social inequality', 'economic crisis', 'enlightenment ideas'], outcomes: ['end of monarchy', 'rise of democracy', 'napoleon'], significance: 'influenced modern democracy' });
    this.addFact('industrial revolution', { type: 'event', years: '1760-1840', location: 'Britain', causes: ['agricultural revolution', 'technological innovation', 'capitalism'], outcomes: ['urbanization', 'factory system', 'middle class'], significance: 'transformed human society' });
    this.addFact('american revolution', { type: 'event', years: '1765-1783', location: 'American colonies', causes: ['taxation without representation', 'enlightenment ideas'], outcomes: ['independence', 'US constitution', 'democracy'], significance: 'inspired other revolutions' });
    this.addFact('renaissance', { type: 'event', years: '1300-1600', location: 'Italy → Europe', causes: ['fall of Constantinople', 'trade wealth', 'humanism'], outcomes: ['artistic achievement', 'scientific inquiry', 'printing press'], significance: 'cultural rebirth' });
    this.addFact('apollo 11 moon landing', { type: 'event', year: 1969, participants: 'NASA', astronauts: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'], significance: 'first humans on the moon', location: 'Sea of Tranquility' });

    // ===== COMPREHENSIVE RELATIONS =====
    this.addRelation('earth', 'orbits', 'sun');
    this.addRelation('moon', 'orbits', 'earth');
    this.addRelation('mars', 'orbits', 'sun');
    this.addRelation('jupiter', 'orbits', 'sun');
    this.addRelation('saturn', 'orbits', 'sun');
    this.addRelation('mercury', 'orbits', 'sun');
    this.addRelation('venus', 'orbits', 'sun');
    this.addRelation('neptune', 'orbits', 'sun');
    this.addRelation('pluto', 'orbits', 'sun');
    this.addRelation('milky way', 'contains', 'sun');
    this.addRelation('water', 'contains', 'hydrogen');
    this.addRelation('water', 'contains', 'oxygen');
    this.addRelation('carbon dioxide', 'contains', 'carbon');
    this.addRelation('carbon dioxide', 'contains', 'oxygen');
    this.addRelation('sodium chloride', 'contains', 'sodium');
    this.addRelation('sodium chloride', 'contains', 'chlorine');
    this.addRelation('glucose', 'contains', 'carbon');
    this.addRelation('glucose', 'contains', 'hydrogen');
    this.addRelation('glucose', 'contains', 'oxygen');

    // Programming relations
    this.addRelation('programming', 'uses', 'algorithms');
    this.addRelation('programming', 'implements', 'logic');
    this.addRelation('javascript', 'used_for', 'web development');
    this.addRelation('javascript', 'has_framework', 'React');
    this.addRelation('javascript', 'has_framework', 'Vue');
    this.addRelation('javascript', 'has_framework', 'Angular');
    this.addRelation('python', 'used_for', 'data science');
    this.addRelation('python', 'used_for', 'artificial intelligence');
    this.addRelation('python', 'has_framework', 'Django');
    this.addRelation('python', 'has_framework', 'Flask');
    this.addRelation('java', 'used_for', 'enterprise');
    this.addRelation('java', 'used_for', 'Android development');
    this.addRelation('rust', 'used_for', 'systems programming');
    this.addRelation('rust', 'used_for', 'WebAssembly');
    this.addRelation('go', 'used_for', 'cloud computing');
    this.addRelation('go', 'used_for', 'microservices');
    this.addRelation('typescript', 'based_on', 'JavaScript');
    this.addRelation('kotlin', 'compatible_with', 'Java');
    this.addRelation('swift', 'used_for', 'iOS development');
    this.addRelation('c++', 'used_for', 'game development');
    this.addRelation('c++', 'used_for', 'embedded systems');
    this.addRelation('nebulara', 'supports', 'programming');
    this.addRelation('nebulara', 'enables', 'artificial intelligence');
    this.addRelation('nebulara', 'implements', 'multi-language FFI');
    this.addRelation('nebulara', 'uses', 'symbolic reasoning');

    // Science relations
    this.addRelation('physics', 'studies', 'matter');
    this.addRelation('physics', 'studies', 'energy');
    this.addRelation('physics', 'studies', 'motion');
    this.addRelation('biology', 'studies', 'life');
    this.addRelation('biology', 'studies', 'organisms');
    this.addRelation('chemistry', 'studies', 'substances');
    this.addRelation('chemistry', 'studies', 'reactions');
    this.addRelation('mathematics', 'provides', 'tools for science');
    this.addRelation('computer science', 'applies', 'mathematics');
    this.addRelation('artificial intelligence', 'uses', 'machine learning');
    this.addRelation('artificial intelligence', 'requires', 'data');
    this.addRelation('machine learning', 'requires', 'training data');
    this.addRelation('machine learning', 'uses', 'algorithms');
    this.addRelation('deep learning', 'uses', 'neural networks');
    this.addRelation('neural networks', 'inspired_by', 'brain');
    this.addRelation('quantum mechanics', 'describes', 'subatomic particles');
    this.addRelation('relativity', 'describes', 'spacetime');
    this.addRelation('evolution', 'explains', 'biodiversity');
    this.addRelation('genetics', 'studies', 'heredity');
    this.addRelation('ecology', 'studies', 'ecosystems');
    this.addRelation('thermodynamics', 'studies', 'heat');
    this.addRelation('electromagnetism', 'describes', 'electromagnetic waves');

    // Person relations
    this.addRelation('albert einstein', 'developed', 'theory of relativity');
    this.addRelation('albert einstein', 'won', 'Nobel Prize in Physics');
    this.addRelation('isaac newton', 'developed', 'laws of motion');
    this.addRelation('isaac newton', 'developed', 'calculus');
    this.addRelation('marie curie', 'discovered', 'radioactivity');
    this.addRelation('marie curie', 'won', 'Nobel Prize in Physics');
    this.addRelation('marie curie', 'won', 'Nobel Prize in Chemistry');
    this.addRelation('charles darwin', 'proposed', 'theory of evolution');
    this.addRelation('leonardo da vinci', 'painted', 'Mona Lisa');
    this.addRelation('william shakespeare', 'wrote', 'Hamlet');
    this.addRelation('william shakespeare', 'wrote', 'Romeo and Juliet');
    this.addRelation('nikola tesla', 'invented', 'alternating current');
    this.addRelation('ada lovelace', 'contributed_to', 'first computer program');
    this.addRelation('alan turing', 'developed', 'Turing machine');
    this.addRelation('alan turing', 'broke', 'Enigma code');
    this.addRelation('grace hopper', 'developed', 'COBOL');
    this.addRelation('steve jobs', 'founded', 'Apple');
    this.addRelation('bill gates', 'founded', 'Microsoft');
    this.addRelation('linus torvalds', 'created', 'Linux');
    this.addRelation('linus torvalds', 'created', 'Git');
    this.addRelation('tim berners-lee', 'invented', 'World Wide Web');

    // Country relations
    this.addRelation('united states', 'capital', 'Washington D.C.');
    this.addRelation('china', 'capital', 'Beijing');
    this.addRelation('india', 'capital', 'New Delhi');
    this.addRelation('japan', 'capital', 'Tokyo');
    this.addRelation('germany', 'capital', 'Berlin');
    this.addRelation('united kingdom', 'capital', 'London');
    this.addRelation('france', 'capital', 'Paris');
    this.addRelation('brazil', 'capital', 'Brasilia');
    this.addRelation('australia', 'capital', 'Canberra');
    this.addRelation('canada', 'capital', 'Ottawa');

    // Historical relations
    this.addRelation('world war ii', 'ended', '1945');
    this.addRelation('world war ii', 'preceded_by', 'world war i');
    this.addRelation('french revolution', 'led_to', 'napoleon');
    this.addRelation('industrial revolution', 'began_in', 'Britain');
    this.addRelation('american revolution', 'resulted_in', 'independence');
    this.addRelation('renaissance', 'began_in', 'Italy');
    this.addRelation('apollo 11 moon landing', 'first_human_on_moon', 'Neil Armstrong');

    // Animal relations
    this.addRelation('dog', 'domesticated_from', 'wolf');
    this.addRelation('cat', 'domesticated_from', 'wild cat');
    this.addRelation('lion', 'lives_in', 'Africa');
    this.addRelation('penguin', 'lives_in', 'Antarctica');
    this.addRelation('dolphin', 'lives_in', 'ocean');
    this.addRelation('eagle', 'has', 'keen vision');
    this.addRelation('elephant', 'has', 'long memory');
    this.addRelation('butterfly', 'undergoes', 'metamorphosis');

    // Food relations
    this.addRelation('pizza', 'originates_from', 'Italy');
    this.addRelation('sushi', 'originates_from', 'Japan');
    this.addRelation('rice', 'staple_food_of', 'Asia');
    this.addRelation('chicken', 'is_type_of', 'poultry');
    this.addRelation('apple', 'is_type_of', 'fruit');
    this.addRelation('banana', 'is_type_of', 'fruit');

    // Cross-domain relations
    this.addRelation('mathematics', 'applied_in', 'physics');
    this.addRelation('mathematics', 'applied_in', 'computer science');
    this.addRelation('physics', 'applied_in', 'engineering');
    this.addRelation('chemistry', 'applied_in', 'medicine');
    this.addRelation('biology', 'applied_in', 'medicine');
    this.addRelation('computer science', 'applied_in', 'artificial intelligence');
    this.addRelation('statistics', 'applied_in', 'machine learning');
    this.addRelation('statistics', 'applied_in', 'data science');
    this.addRelation('psychology', 'applied_in', 'artificial intelligence');
    this.addRelation('linguistics', 'applied_in', 'natural language processing');
    this.addRelation('neuroscience', 'inspired', 'artificial intelligence');

    // ===== COMPREHENSIVE RULES =====
    this.addRule(
      { has: ['programming', 'code'] },
      'Programming involves writing code to solve problems',
      0.9
    );
    this.addRule(
      { has: ['artificial intelligence', 'learning'] },
      'AI systems learn from data to make predictions',
      0.85
    );
    this.addRule(
      { has: ['science', 'hypothesis'] },
      'Scientific method involves forming and testing hypotheses',
      0.9
    );
    this.addRule(
      { has: ['mathematics', 'proof'] },
      'Mathematical truth is established through logical proof',
      0.95
    );
    this.addRule(
      { entity_type: 'programming language', has_static: true },
      'Static typing catches errors at compile time',
      0.8
    );
    this.addRule(
      { entity_type: 'programming language', has_dynamic: true },
      'Dynamic typing allows more flexibility but requires runtime checks',
      0.8
    );
    this.addRule(
      { has: ['water', 'hydrogen'] },
      'Water contains hydrogen atoms',
      0.95
    );
    this.addRule(
      { has: ['water', 'oxygen'] },
      'Water contains oxygen atoms',
      0.95
    );
    this.addRule(
      { has: ['sun', 'energy'] },
      'The sun produces energy through nuclear fusion',
      0.95
    );
    this.addRule(
      { has: ['earth', 'life'] },
      'Earth supports life due to its atmosphere and water',
      0.9
    );
    this.addRule(
      { has: ['evolution', 'mutation'] },
      'Evolution occurs through genetic mutation and natural selection',
      0.9
    );
    this.addRule(
      { has: ['brain', 'neurons'] },
      'The brain processes information through neural networks',
      0.95
    );
    this.addRule(
      { has: ['gravity', 'mass'] },
      'Gravity is proportional to mass and inversely proportional to distance squared',
      0.95
    );
    this.addRule(
      { has: ['thermodynamics', 'entropy'] },
      'Entropy of an isolated system always increases',
      0.95
    );
    this.addRule(
      { has: ['machine learning', 'data'] },
      'Machine learning requires training data to build models',
      0.9
    );
    this.addRule(
      { has: ['blockchain', 'decentralization'] },
      'Blockchain enables decentralized and tamper-proof record keeping',
      0.85
    );
    this.addRule(
      { has: ['quantum computing', 'qubits'] },
      'Quantum computers use qubits instead of classical bits',
      0.9
    );
    this.addRule(
      { has: ['cloud computing', 'scalability'] },
      'Cloud computing enables on-demand resource scaling',
      0.85
    );
    this.addRule(
      { has: ['cybersecurity', 'encryption'] },
      'Cybersecurity relies on encryption to protect data',
      0.9
    );
    this.addRule(
      { has: ['cooking', 'heat'] },
      'Cooking involves applying heat to transform food',
      0.9
    );
    this.addRule(
      { has: ['gardening', 'plants'] },
      'Gardening requires understanding plant needs and conditions',
      0.85
    );
    this.addRule(
      { has: ['writing', 'words'] },
      'Writing communicates ideas through structured language',
      0.9
    );
    this.addRule(
      { has: ['photography', 'light'] },
      'Photography captures light to create images',
      0.95
    );
    this.addRule(
      { has: ['fishing', 'water'] },
      'Fishing takes place in water bodies',
      0.9
    );
    this.addRule(
      { has: ['chess', 'strategy'] },
      'Chess requires strategic thinking and planning',
      0.9
    );
    this.addRule(
      { has: ['meditation', 'mindfulness'] },
      'Meditation cultivates mindfulness and awareness',
      0.85
    );
    this.addRule(
      { has: ['yoga', 'breathing'] },
      'Yoga combines physical postures with controlled breathing',
      0.9
    );
    this.addRule(
      { has: ['martial arts', 'discipline'] },
      'Martial arts develop discipline and self-control',
      0.9
    );
    this.addRule(
      { has: ['dancing', 'music'] },
      'Dancing moves rhythmically to music',
      0.95
    );
    this.addRule(
      { has: ['swimming', 'water'] },
      'Swimming involves propelling oneself through water',
      0.95
    );
    this.addRule(
      { has: ['hiking', 'nature'] },
      'Hiking involves walking in natural environments',
      0.9
    );
  }

  _seedFromDataModule() {
    for (const c of CONCEPTS) {
      this.addConcept(c.name, c.def, c.related, c.examples);
    }
    for (const [name, attrs] of FACTS_MAP) {
      if (!this.facts.has(name)) {
        this.facts.set(name, { ...attrs, _source: 'data-module' });
      }
    }
    for (const [s, p, o] of RELATIONS_MAP) {
      this.addRelation(s, p, o);
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  _matchesPattern(entity, attrs, pattern) {
    if (pattern.entity && !entity.toLowerCase().includes(pattern.entity.toLowerCase())) {
      return false;
    }
    if (pattern.type && attrs.type !== pattern.type) {
      return false;
    }
    if (pattern.attribute) {
      for (const [key, value] of Object.entries(pattern.attribute)) {
        if (attrs[key] !== value) return false;
      }
    }
    return true;
  }

  _evaluateCondition(condition, context) {
    if (condition.has) {
      return condition.has.every(item => context[item] !== undefined);
    }
    if (condition.entity_type) {
      return context.type === condition.entity_type;
    }
    if (condition.and) {
      return condition.and.every(c => this._evaluateCondition(c, context));
    }
    if (condition.or) {
      return condition.or.some(c => this._evaluateCondition(c, context));
    }
    return false;
  }

  stats() {
    return {
      facts: this.facts.size,
      relations: this.relations.size,
      rules: this.rules.length,
      concepts: this.concepts.size,
      contexts: this.contexts.size
    };
  }
}

export { KnowledgeBase };
