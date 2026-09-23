import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { MLOPS_SVG_DATASET, MLOPS_SVG_VIEWBOX } from '../../data/mlopsSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const MlopsSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="mlops"
      title="MLOps Roadmap"
      viewBox={MLOPS_SVG_VIEWBOX}
      dataset={MLOPS_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default MlopsSvgRoadmap;
