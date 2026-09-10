import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { DEVOPS_SVG_DATASET, DEVOPS_SVG_VIEWBOX } from '../../data/devopsSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const DevopsSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="devops"
      title="DevOps Engineer"
      viewBox={DEVOPS_SVG_VIEWBOX}
      dataset={DEVOPS_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default DevopsSvgRoadmap;
