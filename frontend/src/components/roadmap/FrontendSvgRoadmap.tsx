import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { FRONTEND_SVG_DATASET, FRONTEND_SVG_VIEWBOX } from '../../data/frontendSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const FrontendSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="frontend"
      title="Frontend Developer"
      viewBox={FRONTEND_SVG_VIEWBOX}
      dataset={FRONTEND_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    />
  );
};

export default FrontendSvgRoadmap;
