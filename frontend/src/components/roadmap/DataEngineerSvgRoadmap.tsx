import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { DATA_ENGINEER_SVG_DATASET, DATA_ENGINEER_SVG_VIEWBOX } from '../../data/dataEngineerSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const DataEngineerSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="data-engineer"
      title="Data Engineer"
      viewBox={DATA_ENGINEER_SVG_VIEWBOX}
      dataset={DATA_ENGINEER_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    />
  );
};

export default DataEngineerSvgRoadmap;
