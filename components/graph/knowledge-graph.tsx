'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type NodeMouseHandler,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './custom-nodes';
import { generateGraphFromTopic } from '@/lib/graph-utils';
import type { Topic, Article, SelectedArticle } from '@/lib/types';

interface KnowledgeGraphProps {
  topic: Topic;
  onArticleSelect: (article: SelectedArticle | null) => void;
  selectedArticleId: string | null;
  compareMode: boolean;
  compareArticles: SelectedArticle[];
  onCompareArticleToggle: (article: SelectedArticle) => void;
}

export function KnowledgeGraph({
  topic,
  onArticleSelect,
  selectedArticleId,
  compareMode,
  compareArticles,
  onCompareArticleToggle,
}: KnowledgeGraphProps) {
  const { nodes: initialNodes, edges: initialEdges, articleMap } = useMemo(
    () => generateGraphFromTopic(topic),
    [topic]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when selection or compare mode changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'article') {
          const isSelected = node.id === selectedArticleId;
          const isCompareCandidate = compareMode && compareArticles.some((a) => `article-${a.id}` === node.id);

          return {
            ...node,
            data: {
              ...node.data,
              selected: isSelected,
              isCompareCandidate: isCompareCandidate,
            },
          };
        }
        return node;
      })
    );
  }, [selectedArticleId, compareMode, compareArticles, setNodes]);

  // Reset graph when topic changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateGraphFromTopic(topic);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [topic, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      if (node.type !== 'article') return;

      const articleData = articleMap.get(node.id);
      if (!articleData) return;

      const selectedArticle: SelectedArticle = {
        ...articleData.article,
        subTopicName: articleData.subTopicName,
      };

      if (compareMode) {
        onCompareArticleToggle(selectedArticle);
      } else {
        onArticleSelect(selectedArticle);
      }
    },
    [articleMap, compareMode, onArticleSelect, onCompareArticleToggle]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgesUpdatable={false}
        edgesFocusable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
        <Controls
          showInteractive={false}
          className="!bg-card !border-border"
        />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            if (node.type === 'central') return 'var(--primary)';
            if (node.type === 'subTopic') return 'var(--secondary)';
            const leaning = (node.data as { leaning?: string })?.leaning;
            const colors: Record<string, string> = {
              'left': '#2563eb',
              'lean-left': '#0ea5e9',
              'center': '#a855f7',
              'lean-right': '#f97316',
              'right': '#dc2626',
              'neutral': '#6b7280',
            };
            return colors[leaning || 'neutral'];
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
          className="!bg-card !border-border"
        />
      </ReactFlow>
    </div>
  );
}
