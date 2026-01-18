'use client';

import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { skeletonNodeTypes } from '@/components/ui/skeleton-node';

/**
 * Generate skeleton graph layout with 7 nodes:
 * - 1 central node
 * - 2 subTopic nodes
 * - 4 article nodes (2 per subTopic)
 */
function generateSkeletonGraph() {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Central node position
  const centerX = 400;
  const centerY = 300;
  const subTopicRadius = 220;
  const articleRadius = 100;

  // Central node
  const centralNode: Node = {
    id: 'skeleton-central',
    type: 'central',
    position: { x: centerX, y: centerY },
    data: { label: '' },
    draggable: false,
    selectable: false,
  };
  nodes.push(centralNode);

  // Two sub-topics positioned around the center
  const subTopicCount = 2;
  const subTopics = [
    { id: 'skeleton-subtopic-1', angle: -Math.PI / 2 }, // Top
    { id: 'skeleton-subtopic-2', angle: Math.PI / 2 },  // Bottom
  ];

  subTopics.forEach((subTopic, subIndex) => {
    const angle = subTopic.angle;
    const subX = centerX + subTopicRadius * Math.cos(angle);
    const subY = centerY + subTopicRadius * Math.sin(angle);

    const subTopicNode: Node = {
      id: subTopic.id,
      type: 'subTopic',
      position: { x: subX, y: subY },
      data: { label: '' },
      draggable: false,
      selectable: false,
    };
    nodes.push(subTopicNode);

    // Edge from central to sub-topic
    edges.push({
      id: `skeleton-edge-central-${subTopic.id}`,
      source: 'skeleton-central',
      target: subTopic.id,
      style: { stroke: 'var(--border)', strokeWidth: 2 },
      animated: false,
      selectable: false,
    });

    // Two articles per sub-topic, positioned in a fan
    const articleCount = 2;
    const spreadAngle = Math.PI * 0.6; // 108 degrees spread

    for (let articleIndex = 0; articleIndex < articleCount; articleIndex++) {
      const articleAngle = angle - spreadAngle / 2 + (spreadAngle * articleIndex) / (articleCount - 1 || 1);
      const articleX = subX + articleRadius * Math.cos(articleAngle);
      const articleY = subY + articleRadius * Math.sin(articleAngle);

      const articleNodeId = `skeleton-article-${subTopic.id}-${articleIndex}`;

      const articleNode: Node = {
        id: articleNodeId,
        type: 'article',
        position: { x: articleX, y: articleY },
        data: {},
        draggable: false,
        selectable: false,
      };
      nodes.push(articleNode);

      // Edge from sub-topic to article
      edges.push({
        id: `skeleton-edge-${subTopic.id}-${articleIndex}`,
        source: subTopic.id,
        target: articleNodeId,
        style: { stroke: 'var(--border)', strokeWidth: 1.5 },
        animated: false,
        selectable: false,
      });
    }
  });

  return { nodes, edges };
}

export function SkeletonGraph() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateSkeletonGraph(),
    []
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={skeletonNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
        <Controls 
          showInteractive={false}
          className="!bg-card !border-border"
        />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor="var(--muted)"
          maskColor="rgba(0, 0, 0, 0.8)"
          className="!bg-card !border-border"
        />
      </ReactFlow>
    </div>
  );
}

