import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { FULLSTACK_SVG_DATASET, FULLSTACK_SVG_VIEWBOX } from '../../data/fullstackSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const FullstackSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="fullstack"
      title="Full Stack Developer"
      viewBox={FULLSTACK_SVG_VIEWBOX}
      dataset={FULLSTACK_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    
      selectedNodeId={selectedNodeId}
    />
  );
};

export default FullstackSvgRoadmap;
