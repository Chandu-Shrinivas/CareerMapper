import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { AI_ENGINEER_SVG_DATASET, AI_ENGINEER_SVG_VIEWBOX } from '../../data/aiEngineerSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const AiEngineerSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="ai-engineer"
      title="AI Engineer"
      viewBox={AI_ENGINEER_SVG_VIEWBOX}
      dataset={AI_ENGINEER_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default AiEngineerSvgRoadmap;
