import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { FULLSTACK_SVG_DATASET, FULLSTACK_SVG_VIEWBOX } from '../../data/fullstackSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const FullstackSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="fullstack"
      title="Full Stack Developer"
      viewBox={FULLSTACK_SVG_VIEWBOX}
      dataset={FULLSTACK_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default FullstackSvgRoadmap;
