import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { AI_DATA_SCIENTIST_SVG_DATASET, AI_DATA_SCIENTIST_SVG_VIEWBOX } from '../../data/aiDataScientistSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const AiDataScientistSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="ai-data-scientist"
      title="AI & Data Scientist"
      viewBox={AI_DATA_SCIENTIST_SVG_VIEWBOX}
      dataset={AI_DATA_SCIENTIST_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default AiDataScientistSvgRoadmap;
