import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { DATA_ANALYST_SVG_DATASET, DATA_ANALYST_SVG_VIEWBOX } from '../../data/dataAnalystSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const DataAnalystSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="data-analyst"
      title="Data Analyst"
      viewBox={DATA_ANALYST_SVG_VIEWBOX}
      dataset={DATA_ANALYST_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    />
  );
};

export default DataAnalystSvgRoadmap;
