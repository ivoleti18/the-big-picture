'use client';

import { useMemo, useState, useEffect } from 'react';
import { X, Sparkles, ArrowLeftRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SelectedArticle, PoliticalLeaning } from '@/lib/types';

interface ComparisonPanelProps {
  articles: SelectedArticle[];
  onRemoveArticle: (id: string) => void;
  onClose: () => void;
}

interface ComparisonAnalysis {
  sharedFacts: string[];
  differences: string[];
  commonThemes: string[];
  dataPoints: string[];
}

const leaningStyles: Record<PoliticalLeaning, { bg: string; border: string; text: string }> = {
  'left': { bg: 'bg-blue-600/20', border: 'border-blue-500', text: 'text-blue-400' },
  'lean-left': { bg: 'bg-sky-500/20', border: 'border-sky-400', text: 'text-sky-300' },
  'center': { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' },
  'lean-right': { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-300' },
  'right': { bg: 'bg-red-600/20', border: 'border-red-500', text: 'text-red-400' },
  'neutral': { bg: 'bg-gray-500/20', border: 'border-gray-400', text: 'text-gray-300' },
};

/**
 * Extract data points (numbers, percentages, statistics) from text
 */
function extractDataPoints(text: string): string[] {
  // Match patterns like: "$25B", "10%", "13%", "150,000", "$2.6T", etc.
  const numberPatterns = [
    /\$\d+(?:\.\d+)?[BMKkmbt]?/gi, // Currency: $25B, $2.6T
    /\d+(?:,\d{3})*(?:\.\d+)?%/g, // Percentages: 10%, 13.5%
    /\d+(?:,\d{3})+(?!%)/g, // Large numbers: 150,000 (but not 10,000%)
    /\d+\.\d+%?/g, // Decimals: 2.5, 0.7%
  ];
  
  const matches: string[] = [];
  numberPatterns.forEach(pattern => {
    const found = text.match(pattern) || [];
    matches.push(...found);
  });
  
  return [...new Set(matches)].slice(0, 10); // Unique values, max 10
}

/**
 * Extract semantic concepts from text (beyond simple keywords)
 */
function extractThemes(text: string): string[] {
  const lowerText = text.toLowerCase();
  const themes: string[] = [];
  
  // Economic themes
  if (lowerText.match(/\b(cost|price|budget|investment|economy|economic|financial|funding)\b/)) {
    themes.push('economic impact');
  }
  
  // Safety/risk themes
  if (lowerText.match(/\b(safety|risk|danger|accident|disaster|harm|secure)\b/)) {
    themes.push('safety concerns');
  }
  
  // Environmental themes
  if (lowerText.match(/\b(environment|climate|carbon|emission|pollution|sustainability)\b/)) {
    themes.push('environmental impact');
  }
  
  // Health themes
  if (lowerText.match(/\b(health|wellbeing|mental|physical|disease|illness)\b/)) {
    themes.push('health considerations');
  }
  
  // Social themes
  if (lowerText.match(/\b(social|community|society|people|workers|employees|family)\b/)) {
    themes.push('social implications');
  }
  
  // Innovation/technology themes
  if (lowerText.match(/\b(innovation|technology|research|development|progress|advancement)\b/)) {
    themes.push('innovation potential');
  }
  
  // Jobs/employment themes
  if (lowerText.match(/\b(jobs|employment|workers|workforce|careers|unemployment)\b/)) {
    themes.push('employment impact');
  }
  
  return [...new Set(themes)];
}

/**
 * Calculate semantic similarity between two strings (simple word overlap)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().match(/\b\w+\b/g) || []);
  const words2 = new Set(str2.toLowerCase().match(/\b\w+\b/g) || []);
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Enhanced comparison analysis with semantic understanding
 */
function analyzeComparison(articles: SelectedArticle[]): ComparisonAnalysis {
  if (articles.length < 2) {
    return { sharedFacts: [], differences: [], commonThemes: [], dataPoints: [] };
  }

  const analysis: ComparisonAnalysis = {
    sharedFacts: [],
    differences: [],
    commonThemes: [],
    dataPoints: [],
  };

  // Collect all summaries and key facts
  const allSummaries = articles.flatMap(a => a.summary);
  const allKeyFacts = articles.flatMap(a => a.keyFacts || []);
  const allText = [...allSummaries, ...allKeyFacts].join(' ');

  // 1. Extract and match data points (numbers, statistics)
  const allDataPoints: Map<string, number> = new Map();
  articles.forEach(article => {
    const articleText = [...article.summary, ...(article.keyFacts || [])].join(' ');
    const points = extractDataPoints(articleText);
    points.forEach(point => {
      allDataPoints.set(point, (allDataPoints.get(point) || 0) + 1);
    });
  });

  // Find shared data points (mentioned in 2+ articles)
  const sharedDataPoints = Array.from(allDataPoints.entries())
    .filter(([_, count]) => count >= 2)
    .map(([point]) => point);

  if (sharedDataPoints.length > 0) {
    analysis.dataPoints = sharedDataPoints.slice(0, 5);
    analysis.sharedFacts.push(
      `Both sources cite similar data: ${sharedDataPoints.slice(0, 3).join(', ')}${sharedDataPoints.length > 3 ? '...' : ''}`
    );
  }

  // 2. Extract exact matching key facts
  const factCounts = new Map<string, number>();
  allKeyFacts.forEach(fact => {
    const normalized = fact.toLowerCase().trim();
    factCounts.set(normalized, (factCounts.get(normalized) || 0) + 1);
  });

  const exactMatches = Array.from(factCounts.entries())
    .filter(([_, count]) => count >= 2)
    .map(([fact]) => fact);

  exactMatches.slice(0, 3).forEach(match => {
    // Find the original casing
    const originalFact = allKeyFacts.find(f => f.toLowerCase().trim() === match);
    if (originalFact) {
      analysis.sharedFacts.push(`Both agree: "${originalFact}"`);
    }
  });

  // 3. Semantic similarity in summaries (find similar statements)
  const summaryPairs: Array<{ text1: string; text2: string; similarity: number }> = [];
  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      articles[i].summary.forEach(s1 => {
        articles[j].summary.forEach(s2 => {
          const similarity = calculateSimilarity(s1, s2);
          if (similarity > 0.3) { // 30% word overlap threshold
            summaryPairs.push({ text1: s1, text2: s2, similarity });
          }
        });
      });
    }
  }

  // Extract concepts from most similar pairs
  summaryPairs
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .forEach(({ text1 }) => {
      // Extract the core fact from similar statements
      const words = text1.split(' ').slice(0, 10).join(' '); // First 10 words
      if (!analysis.sharedFacts.some(f => f.includes(words.slice(0, 20)))) {
        analysis.sharedFacts.push(`Similar perspective: "${words}..."`);
      }
    });

  // 4. Extract common themes
  const allThemes = articles.flatMap(a => {
    const text = [...a.summary, ...(a.keyFacts || [])].join(' ');
    return extractThemes(text);
  });

  const themeCounts = new Map<string, number>();
  allThemes.forEach(theme => {
    themeCounts.set(theme, (themeCounts.get(theme) || 0) + 1);
  });

  const commonThemes = Array.from(themeCounts.entries())
    .filter(([_, count]) => count >= 2)
    .map(([theme]) => theme)
    .slice(0, 3);

  analysis.commonThemes = commonThemes.map(theme => 
    `Both perspectives address ${theme}`
  );

  // 5. Detect differences (opposing perspectives)
  const leanings = articles.map(a => a.leaning);
  const hasOpposing = 
    (leanings.includes('left') || leanings.includes('lean-left')) &&
    (leanings.includes('right') || leanings.includes('lean-right'));

  if (hasOpposing) {
    // Find different emphases in summaries
    const leftArticles = articles.filter(a => 
      a.leaning === 'left' || a.leaning === 'lean-left'
    );
    const rightArticles = articles.filter(a => 
      a.leaning === 'right' || a.leaning === 'lean-right'
    );

    // Simple heuristic: check for different keyword emphasis
    const leftText = leftArticles.flatMap(a => a.summary).join(' ').toLowerCase();
    const rightText = rightArticles.flatMap(a => a.summary).join(' ').toLowerCase();

    if (leftText.includes('social') && !rightText.includes('social')) {
      analysis.differences.push('Left-leaning sources emphasize social implications more');
    }
    if (rightText.includes('economic') && !leftText.includes('economic')) {
      analysis.differences.push('Right-leaning sources focus more on economic outcomes');
    }
  }

  // 6. Add meta-observations
  if (articles.length >= 2) {
    if (articles[0].subTopicName === articles[1]?.subTopicName) {
      analysis.commonThemes.push(
        `Both examine the "${articles[0].subTopicName}" dimension of this topic`
      );
    }

    if (hasOpposing) {
      analysis.commonThemes.push(
        'Despite political differences, both recognize the multifaceted nature of this issue'
      );
    }
  }

  // Limit results
  analysis.sharedFacts = [...new Set(analysis.sharedFacts)].slice(0, 5);
  analysis.commonThemes = [...new Set(analysis.commonThemes)].slice(0, 4);
  analysis.differences = [...new Set(analysis.differences)].slice(0, 3);

  return analysis;
}

export function ComparisonPanel({ articles, onRemoveArticle, onClose }: ComparisonPanelProps) {
  const [aiAnalysis, setAiAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Fallback heuristic analysis
  const heuristicAnalysis = useMemo(() => analyzeComparison(articles), [articles]);

  // Call Gemini API for deep analysis when articles change
  useEffect(() => {
    if (articles.length < 2) {
      setAiAnalysis(null);
      setIsAnalyzing(false);
      setAnalysisError(null);
      return;
    }

    let cancelled = false;

    async function fetchAnalysis() {
      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        const response = await fetch('/api/analyze-comparison', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ articles }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: ComparisonAnalysis = await response.json();

        if (!cancelled) {
          setAiAnalysis(data);
          setIsAnalyzing(false);
        }
      } catch (error) {
        console.error('Comparison analysis error:', error);
        if (!cancelled) {
          setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
          setAiAnalysis(null);
          setIsAnalyzing(false);
        }
      }
    }

    fetchAnalysis();

    return () => {
      cancelled = true;
    };
  }, [articles]);

  // Use AI analysis if available, otherwise fall back to heuristic
  const analysis = aiAnalysis || heuristicAnalysis;

  if (articles.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
          <ArrowLeftRight className="w-8 h-8 text-yellow-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Compare Perspectives</h3>
        <p className="text-sm text-muted-foreground max-w-[260px]">
          Select 2 or more articles from different perspectives to discover common ground and key differences.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-yellow-500" />
            Compare Views
            {isAnalyzing && (
              <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
            )}
          </h2>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close comparison</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length !== 1 ? 's' : ''} selected
          {isAnalyzing && (
            <span className="ml-2 text-yellow-500">• Analyzing with AI...</span>
          )}
          {!isAnalyzing && aiAnalysis && (
            <span className="ml-2 text-green-500">• AI-enhanced analysis</span>
          )}
          {!isAnalyzing && !aiAnalysis && articles.length >= 2 && (
            <span className="ml-2 text-muted-foreground/70">• Using heuristic analysis</span>
          )}
        </p>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Loading State */}
          {isAnalyzing && (
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Analyzing with AI...
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Finding shared facts and nuanced differences
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Articles */}
          {articles.map((article) => {
            const style = leaningStyles[article.leaning];
            return (
              <Card key={article.id} className={cn("border", style.border, style.bg)}>
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Badge 
                        className={cn(
                          "mb-2 text-xs",
                          style.bg,
                          style.border,
                          style.text
                        )}
                      >
                        {article.leaning.replace('-', ' ')}
                      </Badge>
                      <CardTitle className="text-sm font-semibold text-foreground leading-tight mb-1">
                        {article.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {article.source}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => onRemoveArticle(article.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {article.summary[0]}
                  </p>
                  {article.keyFacts && article.keyFacts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {article.keyFacts.slice(0, 2).map((fact, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-muted-foreground/30 text-muted-foreground"
                        >
                          {fact}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Common Themes */}
          {articles.length >= 2 && analysis.commonThemes.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Common Themes
                </h3>
                <Card className="border-yellow-500/30 bg-yellow-500/10">
                  <CardContent className="p-4">
                    <ul className="space-y-2">
                      {analysis.commonThemes.map((theme, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="text-yellow-500 shrink-0">•</span>
                          <span className="text-foreground/90">{theme}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Shared Facts - The "Aha!" Moment */}
          {articles.length >= 2 && analysis.sharedFacts.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  Shared Facts & Data Points
                </h3>
                <Card className="border-green-500/30 bg-green-500/10">
                  <CardContent className="p-4">
                    <ul className="space-y-2.5">
                      {analysis.sharedFacts.map((fact, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="text-green-500 shrink-0 font-bold">✓</span>
                          <span className="text-foreground/90 leading-relaxed">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {analysis.dataPoints.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {analysis.dataPoints.map((point, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-green-500/20 text-green-400 border border-green-500/40 font-mono"
                      >
                        {point}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-3 text-center italic">
                  💡 The "Aha!" Moment: Shared facts across different perspectives
                </p>
              </div>
            </>
          )}

          {/* Key Differences */}
          {articles.length >= 2 && analysis.differences.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Where They Differ
                </h3>
                <Card className="border-orange-500/30 bg-orange-500/10">
                  <CardContent className="p-4">
                    <ul className="space-y-2">
                      {analysis.differences.map((diff, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="text-orange-500 shrink-0">→</span>
                          <span className="text-foreground/90">{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Empty State - No Analysis Yet */}
          {articles.length >= 2 && 
           analysis.sharedFacts.length === 0 && 
           analysis.commonThemes.length === 0 && 
           analysis.differences.length === 0 && (
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Select articles with more overlapping content to reveal comparisons
              </p>
            </div>
          )}

          {/* Prompt for more */}
          {articles.length < 2 && (
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Select one more article to reveal common ground
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
