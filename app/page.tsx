'use client';

import { useState, useCallback } from 'react';
import { AppHeader } from '@/components/header/app-header';
import { KnowledgeGraph } from '@/components/graph/knowledge-graph';
import { SkeletonGraph } from '@/components/graph/skeleton-graph';
import { ContextSidebar } from '@/components/sidebar/context-sidebar';
import { ComparisonPanel } from '@/components/comparison/comparison-panel';
import { SpectrumLegend } from '@/components/ui/spectrum-legend';
import { LegalDisclaimer } from '@/components/ui/legal-disclaimer';
import { demoTopics } from '@/lib/demo-data';
import type { Topic, SelectedArticle } from '@/lib/types';

export default function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(demoTopics[0]);
  const [selectedArticle, setSelectedArticle] = useState<SelectedArticle | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareArticles, setCompareArticles] = useState<SelectedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicChange = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedArticle(null);
    setCompareArticles([]);
  }, []);

  const handleArticleSelect = useCallback((article: SelectedArticle | null) => {
    setSelectedArticle(article);
  }, []);

  const handleCompareModeToggle = useCallback(() => {
    setCompareMode((prev) => {
      if (prev) {
        // Exiting compare mode, clear selections
        setCompareArticles([]);
      }
      return !prev;
    });
  }, []);

  const handleCompareArticleToggle = useCallback((article: SelectedArticle) => {
    setCompareArticles((prev) => {
      const exists = prev.some((a) => a.id === article.id);
      if (exists) {
        return prev.filter((a) => a.id !== article.id);
      }
      // Limit to 3 articles for comparison
      if (prev.length >= 3) {
        return [...prev.slice(1), article];
      }
      return [...prev, article];
    });
  }, []);

  const handleRemoveCompareArticle = useCallback((id: string) => {
    setCompareArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const handleCloseComparison = useCallback(() => {
    setCompareMode(false);
    setCompareArticles([]);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <AppHeader
        selectedTopic={selectedTopic}
        onTopicChange={handleTopicChange}
        compareMode={compareMode}
        onCompareModeToggle={handleCompareModeToggle}
        compareCount={compareArticles.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph Area */}
        <main className="flex-1 relative">
          {isLoading ? (
            <SkeletonGraph />
          ) : (
            <KnowledgeGraph
              topic={selectedTopic}
              onArticleSelect={handleArticleSelect}
              selectedArticleId={selectedArticle ? `article-${selectedArticle.id}` : null}
              compareMode={compareMode}
              compareArticles={compareArticles}
              onCompareArticleToggle={handleCompareArticleToggle}
            />
          )}
          
          {/* Spectrum Legend */}
          <div className="absolute bottom-0 left-0 right-0">
            <SpectrumLegend />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-[380px] border-l border-border bg-card hidden lg:flex flex-col">
          {compareMode ? (
            <ComparisonPanel
              articles={compareArticles}
              onRemoveArticle={handleRemoveCompareArticle}
              onClose={handleCloseComparison}
            />
          ) : (
            <ContextSidebar
              article={selectedArticle}
              onClose={handleCloseSidebar}
            />
          )}
        </aside>
      </div>

      {/* Footer */}
      <LegalDisclaimer />
    </div>
  );
}
