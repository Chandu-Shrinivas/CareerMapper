import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { DEVSECOPS_SVG_DATASET, DEVSECOPS_SVG_VIEWBOX } from '../../data/devSecOpsSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const DevSecOpsSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="devsecops"
      title="DevSecOps Expert"
      viewBox={DEVSECOPS_SVG_VIEWBOX}
      dataset={DEVSECOPS_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    />
  );
};

export default DevSecOpsSvgRoadmap;
