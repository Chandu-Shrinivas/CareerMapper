import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { AI_DATA_SCIENTIST_SVG_DATASET, AI_DATA_SCIENTIST_SVG_VIEWBOX } from '../../data/aiDataScientistSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const AiDataScientistSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="ai-data-scientist"
      title="AI & Data Scientist"
      viewBox={AI_DATA_SCIENTIST_SVG_VIEWBOX}
      dataset={AI_DATA_SCIENTIST_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    />
  );
};

export default AiDataScientistSvgRoadmap;
