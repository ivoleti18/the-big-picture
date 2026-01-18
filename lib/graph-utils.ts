import type { Node, Edge } from '@xyflow/react';
import type { Topic, Article } from './types';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  articleMap: Map<string, { article: Article; subTopicName: string }>;
}

export function generateGraphFromTopic(topic: Topic): GraphData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const articleMap = new Map<string, { article: Article; subTopicName: string }>();

  // Central node
  const centralNode: Node = {
    id: 'central',
    type: 'central',
    position: { x: 400, y: 300 },
    data: { label: topic.name },
    draggable: false,
  };
  nodes.push(centralNode);

  // Calculate positions for sub-topics in a circle around the center
  const subTopicCount = topic.subTopics.length;
  const subTopicRadius = 220;
  const centerX = 400;
  const centerY = 300;

  topic.subTopics.forEach((subTopic, subIndex) => {
    // Position sub-topics evenly around the center
    const angle = (2 * Math.PI * subIndex) / subTopicCount - Math.PI / 2;
    const subX = centerX + subTopicRadius * Math.cos(angle);
    const subY = centerY + subTopicRadius * Math.sin(angle);

    const subTopicNode: Node = {
      id: `subtopic-${subTopic.id}`,
      type: 'subTopic',
      position: { x: subX, y: subY },
      data: { label: subTopic.name },
    };
    nodes.push(subTopicNode);

    // Edge from central to sub-topic
    edges.push({
      id: `edge-central-${subTopic.id}`,
      source: 'central',
      target: `subtopic-${subTopic.id}`,
      style: { stroke: 'var(--border)', strokeWidth: 2 },
      animated: false,
      selectable: false,
      deletable: false,
    });

    // Calculate positions for articles around each sub-topic
    const articleCount = subTopic.articles.length;
    const articleRadius = 100;

    subTopic.articles.forEach((article, articleIndex) => {
      // Position articles in a fan around their sub-topic, away from center
      const baseAngle = angle;
      const spreadAngle = Math.PI * 0.6; // 108 degrees spread
      const articleAngle = baseAngle - spreadAngle / 2 + (spreadAngle * articleIndex) / Math.max(articleCount - 1, 1);
      
      const articleX = subX + articleRadius * Math.cos(articleAngle);
      const articleY = subY + articleRadius * Math.sin(articleAngle);

      const articleNodeId = `article-${article.id}`;
      
      const articleNode: Node = {
        id: articleNodeId,
        type: 'article',
        position: { x: articleX, y: articleY },
        data: {
          label: article.title,
          source: article.source,
          leaning: article.leaning,
          selected: false,
          isCompareCandidate: false,
        },
      };
      nodes.push(articleNode);

      // Store article reference
      articleMap.set(articleNodeId, { article, subTopicName: subTopic.name });

      // Edge from sub-topic to article
      edges.push({
        id: `edge-${subTopic.id}-${article.id}`,
        source: `subtopic-${subTopic.id}`,
        target: articleNodeId,
        style: { stroke: 'var(--border)', strokeWidth: 1.5 },
        animated: false,
        selectable: false,
        deletable: false,
      });
    });
  });

  return { nodes, edges, articleMap };
}

export function getEdgeColor(leaning: string): string {
  const colors: Record<string, string> = {
    'left': '#2563eb',
    'lean-left': '#0ea5e9',
    'center': '#a855f7',
    'lean-right': '#f97316',
    'right': '#dc2626',
    'neutral': '#6b7280',
  };
  return colors[leaning] || colors.neutral;
}
