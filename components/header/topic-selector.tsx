'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Topic } from '@/lib/types';
import { demoTopics } from '@/lib/demo-data';

interface TopicSelectorProps {
  selectedTopic: Topic;
  onTopicChange: (topic: Topic) => void;
}

export function TopicSelector({ selectedTopic, onTopicChange }: TopicSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Topic Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <span className="hidden sm:inline">Select Topic</span>
            <span className="sm:hidden">{selectedTopic.name}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          {demoTopics.map((topic) => (
            <DropdownMenuItem
              key={topic.id}
              onClick={() => onTopicChange(topic)}
              className="flex flex-col items-start gap-1 py-3 cursor-pointer"
            >
              <span className="font-medium text-foreground">{topic.name}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {topic.description}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
