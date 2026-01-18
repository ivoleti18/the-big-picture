import type { SelectedArticle, PoliticalLeaning, SharedFactualBaseline, DivergencePoint, EvidencePattern, AnalyticalComparison, PerspectiveAnalysis } from './types';

// Extract shared factual baseline - events, data points, constraints that multiple sources agree on
export function findSharedFactualBaseline(articles: SelectedArticle[]): SharedFactualBaseline[] {
  if (articles.length < 2) return [];

  const sharedFacts: Map<string, Set<string>> = new Map();

  // Extract numerical data points
  const numberPattern = /\d+(?:,\d+)*(?:\.\d+)?(?:\s*(?:billion|million|thousand|%|percent|years?|months?|people|workers?|jobs?|times?))?/gi;
  
  // Extract key factual claims from summaries and keyFacts
  articles.forEach(article => {
    const allText = [...(article.summary || []), ...(article.keyFacts || [])].join(' ');
    
    // Extract numbers that represent data points
    const numbers = allText.match(numberPattern) || [];
    numbers.forEach(num => {
      const normalized = num.toLowerCase().trim();
      if (!sharedFacts.has(normalized)) {
        sharedFacts.set(normalized, new Set());
      }
      sharedFacts.get(normalized)!.add(article.source);
    });

    // Extract events and named entities
    const eventPatterns = [
      /(?:Fukushima|Chernobyl|Three Mile Island|Vogtle|Yucca Mountain|Apollo|Mars|Germany|China)/gi,
      /(?:disaster|accident|displacement|deaths?|casualties?|overruns?)/gi
    ];

    eventPatterns.forEach(pattern => {
      const matches = allText.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const normalized = match.toLowerCase().trim();
          if (!sharedFacts.has(normalized)) {
            sharedFacts.set(normalized, new Set());
          }
          sharedFacts.get(normalized)!.add(article.source);
        });
      }
    });

    // Extract constraints (cost, time, scale, emissions)
    const constraintKeywords = [
      /\$\d+.*(?:billion|million|thousand)/gi,
      /(?:cost|price|budget|spending|investment)/gi,
      /(?:timeline|schedule|years?|months?|decades?)/gi,
      /(?:emissions?|carbon|pollution|climate)/gi
    ];

    constraintKeywords.forEach(pattern => {
      const matches = allText.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const normalized = match.toLowerCase().trim();
          if (normalized.length > 3) {
            if (!sharedFacts.has(normalized)) {
              sharedFacts.set(normalized, new Set());
            }
            sharedFacts.get(normalized)!.add(article.source);
          }
        });
      }
    });
  });

  // Build factual baseline - only facts mentioned by 2+ sources
  const baseline: SharedFactualBaseline[] = [];
  sharedFacts.forEach((sources, fact) => {
    if (sources.size >= 2) {
      // Find the actual context for this fact
      const contexts: string[] = [];
      articles.forEach(article => {
        const allText = [...(article.summary || []), ...(article.keyFacts || [])].join(' ');
        if (allText.toLowerCase().includes(fact)) {
          // Extract surrounding context
          const sentences = allText.split(/[.!?]+/);
          const relevantSentence = sentences.find(s => s.toLowerCase().includes(fact));
          if (relevantSentence) {
            contexts.push(relevantSentence.trim().replace(/\s+/g, ' '));
          }
        }
      });

      // Use the most complete context or the fact itself
      const bestContext = contexts[0] || fact;
      baseline.push({
        fact: bestContext.length > 200 ? fact : bestContext,
        citedBy: Array.from(sources)
      });
    }
  });

  return baseline.slice(0, 6); // Limit to top 6
}

// Map divergences - where perspectives differ and why
export function mapDivergences(articles: SelectedArticle[]): DivergencePoint[] {
  if (articles.length < 2) return [];

  const divergences: DivergencePoint[] = [];

  // Analyze different framings of the same topic
  const topicAreas = [
    { keywords: ['cost', 'price', 'economics', 'spending'], claim: 'Economic impact' },
    { keywords: ['safety', 'risk', 'danger', 'accident', 'disaster'], claim: 'Safety considerations' },
    { keywords: ['environment', 'climate', 'emissions', 'carbon'], claim: 'Environmental impact' },
    { keywords: ['productivity', 'efficiency', 'output', 'performance'], claim: 'Performance outcomes' },
    { keywords: ['innovation', 'technology', 'advancement'], claim: 'Technological potential' },
    { keywords: ['social', 'community', 'people', 'workers', 'families'], claim: 'Social impact' }
  ];

  topicAreas.forEach(({ keywords, claim }) => {
    const relevantArticles = articles.filter(article => {
      const allText = [...(article.summary || []), ...(article.keyFacts || [])].join(' ').toLowerCase();
      return keywords.some(kw => allText.includes(kw));
    });

    if (relevantArticles.length >= 2) {
      // Extract how each source frames this topic
      const framings = relevantArticles.map(article => {
        const allText = [...(article.summary || []), ...(article.keyFacts || [])];
        const relevantSentences = allText.filter(text => 
          keywords.some(kw => text.toLowerCase().includes(kw))
        );

        // Determine underlying value based on framing language
        const valueIndicators: Record<string, string> = {
          'safety': 'safety',
          'risk': 'safety',
          'cost': 'growth',
          'efficiency': 'growth',
          'equity': 'equity',
          'access': 'equity',
          'freedom': 'freedom',
          'autonomy': 'freedom',
          'security': 'security',
          'defense': 'security',
          'environment': 'environment',
          'climate': 'environment'
        };

        let underlyingValue: string | undefined;
        const combined = relevantSentences.join(' ').toLowerCase();
        for (const [indicator, value] of Object.entries(valueIndicators)) {
          if (combined.includes(indicator)) {
            underlyingValue = value;
            break;
          }
        }

        // Extract framing sentence (first relevant sentence, truncated)
        const framing = relevantSentences[0] || '';
        const truncatedFraming = framing.length > 150 
          ? framing.substring(0, 147) + '...' 
          : framing;

        return {
          leaning: article.leaning,
          source: article.source,
          framing: truncatedFraming,
          underlyingValue
        };
      });

      // Only add if there are meaningful differences in framing
      const uniqueLeanings = new Set(framings.map(f => f.leaning));
      if (uniqueLeanings.size >= 2 || framings.some(f => f.framing.length > 0)) {
        divergences.push({
          claim,
          framings
        });
      }
    }
  });

  return divergences.slice(0, 5); // Limit to top 5
}

// Evidence & Omission Analysis - what each side emphasizes and ignores
export function analyzeEvidencePatterns(articles: SelectedArticle[]): EvidencePattern[] {
  if (articles.length < 2) return [];

  const patterns: EvidencePattern[] = [];

  // Define common topic areas to check for emphasis/omission
  const allTopicAreas = new Set<string>();
  articles.forEach(article => {
    const allText = [...(article.summary || []), ...(article.keyFacts || [])].join(' ').toLowerCase();
    const topics = [
      'cost', 'economics', 'safety', 'risk', 'environment', 'climate',
      'productivity', 'efficiency', 'innovation', 'technology',
      'social', 'health', 'mental', 'community', 'workers',
      'jobs', 'employment', 'freedom', 'autonomy', 'security',
      'equity', 'access', 'waste', 'storage', 'timeline', 'schedule'
    ];
    topics.forEach(topic => {
      if (allText.includes(topic)) {
        allTopicAreas.add(topic);
      }
    });
  });

  articles.forEach(article => {
    const allText = [...(article.summary || []), ...(article.keyFacts || [])].join(' ').toLowerCase();
    
    // Find emphasized evidence
    const emphasizedEvidence: string[] = [];
    const summarySentences = article.summary || [];
    
    // Extract sentences that contain specific claims or data
    summarySentences.forEach(sentence => {
      if (sentence.match(/\d+/) || // Contains numbers
          sentence.match(/(?:study|research|analysis|data|report|findings)/i) || // Contains research language
          sentence.length > 80) { // Substantial claim
        emphasizedEvidence.push(sentence);
      }
    });

    // Find omitted topics (mentioned by other articles but not this one)
    const omittedTopics: string[] = [];
    allTopicAreas.forEach(topic => {
      if (!allText.includes(topic)) {
        // Check if other articles mention this topic
        const othersMention = articles.filter(a => 
          a.id !== article.id && 
          [...a.summary || [], ...a.keyFacts || []].join(' ').toLowerCase().includes(topic)
        );
        if (othersMention.length > 0) {
          omittedTopics.push(topic);
        }
      }
    });

    patterns.push({
      articleId: article.id,
      source: article.source,
      leaning: article.leaning,
      emphasizedEvidence: emphasizedEvidence.slice(0, 3), // Top 3
      omittedTopics: omittedTopics.slice(0, 4) // Top 4 omissions
    });
  });

  return patterns;
}

// Main analytical comparison function
export function generateAnalyticalComparison(articles: SelectedArticle[]): AnalyticalComparison {
  return {
    sharedBaseline: findSharedFactualBaseline(articles),
    divergences: mapDivergences(articles),
    evidenceAnalysis: analyzeEvidencePatterns(articles)
  };
}

// Generate perspective analysis for individual article
export function generatePerspectiveAnalysis(article: SelectedArticle, allArticles?: SelectedArticle[]): PerspectiveAnalysis {
  const allText = [...(article.summary || []), ...(article.keyFacts || [])].join(' ').toLowerCase();
  
  // Extract framing (overall narrative structure)
  const framingKeyPhrases: string[] = [];
  const framingPatterns = [
    /(?:essential|crucial|critical|vital|necessary|required)/gi,
    /(?:threat|risk|danger|concern|problem|issue)/gi,
    /(?:opportunity|benefit|advantage|promise|potential)/gi,
    /(?:proves?|demonstrates?|shows?|indicates?|suggests?)/gi
  ];

  article.summary?.forEach(sentence => {
    framingPatterns.forEach(pattern => {
      if (pattern.test(sentence)) {
        if (!framingKeyPhrases.some(p => sentence.includes(p))) {
          framingKeyPhrases.push(sentence);
        }
      }
    });
  });

  const framing = framingKeyPhrases[0] || article.summary[0] || '';

  // Extract underlying values
  const valueIndicators: Record<string, string> = {
    'safety': 'safety',
    'risk': 'safety',
    'security': 'security',
    'freedom': 'freedom',
    'autonomy': 'freedom',
    'equity': 'equity',
    'access': 'equity',
    'fairness': 'equity',
    'growth': 'growth',
    'efficiency': 'growth',
    'productivity': 'growth',
    'environment': 'environment',
    'climate': 'environment',
    'sustainability': 'environment'
  };

  const underlyingValues: string[] = [];
  for (const [indicator, value] of Object.entries(valueIndicators)) {
    if (allText.includes(indicator) && !underlyingValues.includes(value)) {
      underlyingValues.push(value);
    }
  }

  // Key emphases (what's highlighted most)
  const keyEmphases: string[] = [];
  const emphasisTopics = ['cost', 'safety', 'productivity', 'environment', 'innovation', 'social', 'health'];
  emphasisTopics.forEach(topic => {
    if (allText.includes(topic)) {
      const relevantSentences = (article.summary || []).filter(s => 
        s.toLowerCase().includes(topic)
      );
      if (relevantSentences.length > 0) {
        keyEmphases.push(topic);
      }
    }
  });

  // Potential omissions (if we have other articles for comparison)
  const potentialOmissions: string[] = [];
  if (allArticles && allArticles.length > 1) {
    const allTopics = new Set<string>();
    allArticles.forEach(a => {
      const aText = [...a.summary || [], ...a.keyFacts || []].join(' ').toLowerCase();
      ['cost', 'safety', 'environment', 'productivity', 'social', 'health', 'innovation'].forEach(topic => {
        if (aText.includes(topic)) allTopics.add(topic);
      });
    });

    allTopics.forEach(topic => {
      if (!allText.includes(topic)) {
        potentialOmissions.push(topic);
      }
    });
  }

  // Language patterns (tone and style indicators)
  const languagePatterns: string[] = [];
  if (allText.match(/(?:devastating|tragic|alarming|crisis|dangerous)/gi)) {
    languagePatterns.push('alarmist');
  }
  if (allText.match(/(?:promising|breakthrough|revolutionary|game-changer|transformation)/gi)) {
    languagePatterns.push('optimistic');
  }
  if (allText.match(/(?:however|although|despite|but|nevertheless)/gi)) {
    languagePatterns.push('nuanced');
  }
  if (allText.match(/(?:studies?|research|data|analysis|findings?)/gi)) {
    languagePatterns.push('evidence-based');
  }

  return {
    framing,
    underlyingValues: underlyingValues.slice(0, 4),
    keyEmphases: keyEmphases.slice(0, 4),
    potentialOmissions: potentialOmissions.slice(0, 3),
    languagePatterns
  };
}

