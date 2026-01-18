'use client';

import { useMemo } from 'react';
import { X, ArrowLeftRight, CheckCircle2, GitBranch, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SelectedArticle, PoliticalLeaning } from '@/lib/types';
import { generateAnalyticalComparison } from '@/lib/comparison-analysis';

interface ComparisonPanelProps {
  articles: SelectedArticle[];
  onRemoveArticle: (id: string) => void;
  onClose: () => void;
}

const leaningStyles: Record<PoliticalLeaning, { bg: string; border: string; text: string }> = {
  'left': { bg: 'bg-blue-600/20', border: 'border-blue-500', text: 'text-blue-400' },
  'lean-left': { bg: 'bg-sky-500/20', border: 'border-sky-400', text: 'text-sky-300' },
  'center': { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' },
  'lean-right': { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-300' },
  'right': { bg: 'bg-red-600/20', border: 'border-red-500', text: 'text-red-400' },
  'neutral': { bg: 'bg-gray-500/20', border: 'border-gray-400', text: 'text-gray-300' },
};

export function ComparisonPanel({ articles, onRemoveArticle, onClose }: ComparisonPanelProps) {
  const analysis = useMemo(() => generateAnalyticalComparison(articles), [articles]);

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
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-yellow-500" />
            Compare Views
          </h2>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close comparison</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Selected Articles */}
          {articles.map((article) => {
            const style = leaningStyles[article.leaning];
            return (
              <Card key={article.id} className={cn("border", style.border, style.bg)}>
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Badge 
                        className={cn(
                          "mb-1 text-xs",
                          style.bg,
                          style.border,
                          style.text
                        )}
                      >
                        {article.leaning.replace('-', ' ')}
                      </Badge>
                      <CardTitle className="text-sm font-medium text-foreground leading-tight">
                        {article.source}
                      </CardTitle>
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
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {article.summary[0]}
                  </p>
                </CardContent>
              </Card>
            );
          })}

          {/* A. Shared Factual Baseline */}
          {articles.length >= 2 && analysis.sharedBaseline.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  A. Shared Factual Baseline
                </h3>
                <Card className="border-green-500/30 bg-green-500/10">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-3 italic">
                      All sides agree that...
                    </p>
                    <ul className="space-y-3">
                      {analysis.sharedBaseline.map((item, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-foreground/90">{item.fact}</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {item.citedBy.map((source, i) => (
                                <Badge 
                                  key={i}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 border-green-500/30 text-green-400 bg-green-500/5"
                                >
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* B. Divergence Map */}
          {articles.length >= 2 && analysis.divergences.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-orange-500" />
                  B. Divergence Map
                </h3>
                <div className="space-y-3">
                  {analysis.divergences.map((divergence, index) => (
                    <Card key={index} className="border-orange-500/30 bg-orange-500/10">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">
                          {divergence.claim}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2.5">
                        {divergence.framings.map((framing, fIndex) => {
                          const style = leaningStyles[framing.leaning];
                          return (
                            <div key={fIndex} className={cn("p-2.5 rounded border", style.border, style.bg)}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <Badge 
                                  className={cn(
                                    "text-[10px] px-1.5 py-0",
                                    style.bg,
                                    style.border,
                                    style.text
                                  )}
                                >
                                  {framing.leaning.replace('-', ' ')}
                                </Badge>
                                <span className="text-xs font-medium text-foreground/70">{framing.source}</span>
                                {framing.underlyingValue && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto">
                                    {framing.underlyingValue}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-foreground/80 leading-relaxed">{framing.framing}</p>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center italic">
                  Understanding how different perspectives frame the same issue
                </p>
              </div>
            </>
          )}

          {/* C. Evidence & Omission Analysis */}
          {articles.length >= 2 && analysis.evidenceAnalysis.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                  C. Evidence & Omission Analysis
                </h3>
                <div className="space-y-3">
                  {analysis.evidenceAnalysis.map((pattern) => {
                    const style = leaningStyles[pattern.leaning];
                    return (
                      <Card key={pattern.articleId} className={cn("border", style.border, style.bg)}>
                        <CardHeader className="p-3 pb-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                style.bg,
                                style.border,
                                style.text
                              )}
                            >
                              {pattern.leaning.replace('-', ' ')}
                            </Badge>
                            <CardTitle className="text-sm font-medium text-foreground flex-1">
                              {pattern.source}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 space-y-3">
                          {/* Emphasized Evidence */}
                          {pattern.emphasizedEvidence.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Eye className="w-3.5 h-3.5 text-purple-400" />
                                <span className="text-xs font-medium text-foreground/80">Emphasizes</span>
                              </div>
                              <ul className="space-y-1.5">
                                {pattern.emphasizedEvidence.map((evidence, eIndex) => (
                                  <li key={eIndex} className="flex gap-2 text-xs">
                                    <span className="text-purple-400 shrink-0">•</span>
                                    <span className="text-foreground/80 leading-relaxed">{evidence}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Omissions */}
                          {pattern.omittedTopics.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs font-medium text-foreground/80">Downplays or omits</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {pattern.omittedTopics.map((topic, oIndex) => (
                                  <Badge 
                                    key={oIndex}
                                    variant="secondary"
                                    className="text-[10px] px-2 py-0.5 bg-muted/50 text-muted-foreground"
                                  >
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center italic">
                  What each perspective highlights and what it overlooks
                </p>
              </div>
            </>
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
