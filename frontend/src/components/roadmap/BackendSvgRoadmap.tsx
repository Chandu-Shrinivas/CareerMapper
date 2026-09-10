import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { BACKEND_SVG_DATASET, BACKEND_SVG_VIEWBOX } from '../../data/backendSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const BackendSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="backend"
      title="Backend Developer"
      viewBox={BACKEND_SVG_VIEWBOX}
      dataset={BACKEND_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    />
  );
};

export default BackendSvgRoadmap;
