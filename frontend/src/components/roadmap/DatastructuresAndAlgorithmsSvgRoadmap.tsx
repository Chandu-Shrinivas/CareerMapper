import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { DATASTRUCTURES_AND_ALGORITHMS_SVG_DATASET, DATASTRUCTURES_AND_ALGORITHMS_SVG_VIEWBOX } from '../../data/datastructuresAndAlgorithmsSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const DatastructuresAndAlgorithmsSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="datastructures-and-algorithms"
      title="Data Structures & Algorithms"
      viewBox={DATASTRUCTURES_AND_ALGORITHMS_SVG_VIEWBOX}
      dataset={DATASTRUCTURES_AND_ALGORITHMS_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default DatastructuresAndAlgorithmsSvgRoadmap;
