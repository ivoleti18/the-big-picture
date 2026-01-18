'use client';

import { X, ExternalLink, Brain, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { SelectedArticle, PoliticalLeaning } from '@/lib/types';

interface ContextSidebarProps {
  article: SelectedArticle | null;
  onClose: () => void;
}

const leaningStyles: Record<PoliticalLeaning, { bg: string; border: string; text: string; label: string }> = {
  'left': { bg: 'bg-blue-600/20', border: 'border-blue-500', text: 'text-blue-400', label: 'Left' },
  'lean-left': { bg: 'bg-sky-500/20', border: 'border-sky-400', text: 'text-sky-300', label: 'Lean Left' },
  'center': { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300', label: 'Center' },
  'lean-right': { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-300', label: 'Lean Right' },
  'right': { bg: 'bg-red-600/20', border: 'border-red-500', text: 'text-red-400', label: 'Right' },
  'neutral': { bg: 'bg-gray-500/20', border: 'border-gray-400', text: 'text-gray-300', label: 'Neutral' },
};

export function ContextSidebar({ article, onClose }: ContextSidebarProps) {
  if (!article) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Select an Article</h3>
        <p className="text-sm text-muted-foreground max-w-[240px]">
          Click on any article node in the graph to view its summary and perspective analysis.
        </p>
      </div>
    );
  }

  const style = leaningStyles[article.leaning];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge
            className={cn(
              "px-2 py-1 text-xs font-medium",
              style.bg,
              style.border,
              style.text,
              "border"
            )}
          >
            {style.label}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <h2 className="text-lg font-bold text-foreground leading-tight mb-2 break-words">
          {article.title}
        </h2>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-muted-foreground shrink-0">Source:</span>
          <span className="font-medium text-foreground break-words min-w-0">{article.source}</span>
        </div>

        <div className="flex items-center gap-2 text-sm mt-1 min-w-0">
          <span className="text-muted-foreground shrink-0">Topic:</span>
          <span className="font-medium text-foreground break-words min-w-0">{article.subTopicName}</span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Summary Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              The Gist
            </h3>
            <ul className="space-y-3">
              {article.summary.map((point, index) => (
                <li key={index} className="flex gap-3 text-sm min-w-0">
                  <span className="text-muted-foreground shrink-0 mt-1">•</span>
                  <span className="text-foreground/90 leading-relaxed break-words">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Key Facts */}
          {article.keyFacts && article.keyFacts.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Key Facts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.keyFacts.map((fact, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-green-500/10 text-green-400 border border-green-500/30"
                    >
                      {fact}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Perspective Analysis */}
          {article.perspectiveAnalysis && (
            <>
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="w-full group">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 w-full justify-between hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Perspective Analysis
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                  {/* Confidence Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Confidence Score</span>
                      <span className="text-xs font-semibold text-foreground">{article.perspectiveAnalysis.confidenceScore}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          article.perspectiveAnalysis.confidenceScore >= 75 ? "bg-green-500" :
                          article.perspectiveAnalysis.confidenceScore >= 50 ? "bg-yellow-500" :
                          "bg-orange-500"
                        )}
                        style={{ width: `${article.perspectiveAnalysis.confidenceScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Overall Reasoning */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">Why This Classification</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">{article.perspectiveAnalysis.reasoning}</p>
                  </div>

                  {/* Language Patterns */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">Language Patterns</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Sentiment: </span>
                        <Badge variant="outline" className="text-xs ml-1">
                          {article.perspectiveAnalysis.languagePatterns.sentiment}
                        </Badge>
                      </div>
                      {article.perspectiveAnalysis.languagePatterns.framingIndicators.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Framing Indicators:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {article.perspectiveAnalysis.languagePatterns.framingIndicators.map((indicator, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30"
                              >
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {article.perspectiveAnalysis.languagePatterns.examples.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Examples:</span>
                          <ul className="space-y-1">
                            {article.perspectiveAnalysis.languagePatterns.examples.map((example, index) => (
                              <li key={index} className="text-sm text-foreground/70 italic">
                                "{example}"
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Source Classification */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">Source Classification</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Publication Bias:</span>
                        <p className="text-sm text-foreground/80 leading-relaxed">{article.perspectiveAnalysis.sourceClassification.publicationBias}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Editorial Stance:</span>
                        <p className="text-sm text-foreground/80 leading-relaxed">{article.perspectiveAnalysis.sourceClassification.editorialStance}</p>
                      </div>
                      {article.perspectiveAnalysis.sourceClassification.reputationFactors && 
                       article.perspectiveAnalysis.sourceClassification.reputationFactors.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Reputation Factors:</span>
                          <ul className="space-y-1">
                            {article.perspectiveAnalysis.sourceClassification.reputationFactors.map((factor, index) => (
                              <li key={index} className="text-sm text-foreground/70 flex gap-2">
                                <span className="text-muted-foreground shrink-0 mt-1">•</span>
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Topic Coverage */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">Topic Coverage</h4>
                    <div className="space-y-2">
                      {article.perspectiveAnalysis.topicCoverage.emphasisPoints.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Emphasis Points:</span>
                          <ul className="space-y-1">
                            {article.perspectiveAnalysis.topicCoverage.emphasisPoints.map((point, index) => (
                              <li key={index} className="text-sm text-foreground/70 flex gap-2 min-w-0">
                                <span className="text-muted-foreground shrink-0 mt-1">•</span>
                                <span className="break-words">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Coverage Distribution:</span>
                        <p className="text-sm text-foreground/80 leading-relaxed">{article.perspectiveAnalysis.topicCoverage.coverageDistribution}</p>
                      </div>
                      {article.perspectiveAnalysis.topicCoverage.omissions && 
                       article.perspectiveAnalysis.topicCoverage.omissions.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Notable Omissions:</span>
                          <ul className="space-y-1">
                            {article.perspectiveAnalysis.topicCoverage.omissions.map((omission, index) => (
                              <li key={index} className="text-sm text-foreground/70 flex gap-2 min-w-0">
                                <span className="text-muted-foreground shrink-0 mt-1">•</span>
                                <span className="break-words">{omission}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
            </>
          )}

          {/* Read Original */}
          {article.url && (
            <Button variant="secondary" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              Read Original Article
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
