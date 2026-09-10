import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { BACKEND_SVG_DATASET, BACKEND_SVG_VIEWBOX } from '../../data/backendSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const BackendSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="backend"
      title="Backend Developer"
      viewBox={BACKEND_SVG_VIEWBOX}
      dataset={BACKEND_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default BackendSvgRoadmap;
