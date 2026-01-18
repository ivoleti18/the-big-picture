'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, X, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Topic } from '@/lib/types';

interface TopicSearchProps {
    onTopicSelect: (topic: Topic) => void;
    onSearchStart?: () => void;
    onSearchComplete?: () => void;
    className?: string;
}

interface SearchState {
    query: string;
    isLoading: boolean;
    error: string | null;
    lastSearchedQuery: string | null;
}

export function TopicSearch({
    onTopicSelect,
    onSearchStart,
    onSearchComplete,
    className,
}: TopicSearchProps) {
    const [searchState, setSearchState] = useState<SearchState>({
        query: '',
        isLoading: false,
        error: null,
        lastSearchedQuery: null,
    });

    // Debounce effect - 500ms delay
    useEffect(() => {
        if (searchState.query.trim().length < 3) {
            setSearchState((prev) => ({ ...prev, isLoading: false, error: null }));
            return;
        }

        // Don't search if it's the same query
        if (searchState.query.trim() === searchState.lastSearchedQuery) {
            return;
        }

        const timeoutId = setTimeout(async () => {
            const query = searchState.query.trim();

            setSearchState((prev) => ({ ...prev, isLoading: true, error: null }));
            onSearchStart?.();

            try {
                const response = await fetch('/api/generate-topic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.error || `Search failed: ${response.statusText}`
                    );
                }

                const topic: Topic = await response.json();

                // Validate topic structure
                if (!topic || !topic.id || !topic.name || !topic.subTopics) {
                    throw new Error('Invalid response format from API');
                }

                // Update state and call callback
                setSearchState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: null,
                    lastSearchedQuery: query,
                }));

                onTopicSelect(topic);
                onSearchComplete?.();
            } catch (error) {
                console.error('Search error:', error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred during search.';

                setSearchState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                    lastSearchedQuery: null,
                }));
                onSearchComplete?.();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchState.query, searchState.lastSearchedQuery, onTopicSelect, onSearchStart, onSearchComplete]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchState((prev) => ({ ...prev, query: value, error: null }));
    };

    const handleClear = () => {
        setSearchState({
            query: '',
            isLoading: false,
            error: null,
            lastSearchedQuery: null,
        });
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            handleClear();
        } else if (e.key === 'Enter' && searchState.query.trim().length >= 3) {
            // Cancel debounce and search immediately
            const query = searchState.query.trim();

            if (query === searchState.lastSearchedQuery) {
                return;
            }

            setSearchState((prev) => ({ ...prev, isLoading: true, error: null }));
            onSearchStart?.();

            try {
                const response = await fetch('/api/generate-topic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.error || `Search failed: ${response.statusText}`
                    );
                }

                const topic: Topic = await response.json();

                if (!topic || !topic.id || !topic.name || !topic.subTopics) {
                    throw new Error('Invalid response format from API');
                }

                setSearchState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: null,
                    lastSearchedQuery: query,
                }));

                onTopicSelect(topic);
                onSearchComplete?.();
            } catch (error) {
                console.error('Search error:', error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred during search.';

                setSearchState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                    lastSearchedQuery: null,
                }));
                onSearchComplete?.();
            }
        }
    };

    return (
        <div className={cn('relative flex-1 max-w-md', className)}>
            <div className="relative">
                {/* Search Icon */}
                <Search
                    className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
                        searchState.isLoading
                            ? 'text-primary animate-pulse'
                            : 'text-muted-foreground'
                    )}
                />

                {/* Input Field */}
                <Input
                    type="text"
                    placeholder="Search topics (min 3 characters)..."
                    value={searchState.query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'pl-9 pr-20 w-full bg-muted/50 border-border',
                        searchState.error && 'border-destructive focus-visible:border-destructive',
                        searchState.isLoading && 'pr-20'
                    )}
                    disabled={searchState.isLoading}
                    aria-label="Search topics"
                    aria-invalid={!!searchState.error}
                    aria-describedby={searchState.error ? 'search-error' : undefined}
                />

                {/* Loading Indicator */}
                {searchState.isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                )}

                {/* Clear Button */}
                {!searchState.isLoading && searchState.query && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-muted"
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </Button>
                )}
            </div>

            {/* Error Message */}
            {searchState.error && (
                <div
                    id="search-error"
                    className="absolute left-0 right-0 top-full mt-1.5 flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    role="alert"
                >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="flex-1">{searchState.error}</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                            setSearchState((prev) => ({ ...prev, error: null }))
                        }
                        className="h-5 w-5 shrink-0 hover:bg-destructive/20"
                        aria-label="Dismiss error"
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            )}

            {/* Minimum Character Hint */}
            {searchState.query.length > 0 &&
                searchState.query.length < 3 &&
                !searchState.isLoading &&
                !searchState.error && (
                    <p className="absolute left-0 right-0 top-full mt-1 px-3 text-xs text-muted-foreground">
                        Type at least 3 characters to search
                    </p>
                )}
        </div>
    );
}
