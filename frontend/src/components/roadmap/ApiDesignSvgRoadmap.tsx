import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { API_DESIGN_SVG_DATASET, API_DESIGN_SVG_VIEWBOX } from '../../data/apiDesignSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const ApiDesignSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="api-design"
      title="API Design"
      viewBox={API_DESIGN_SVG_VIEWBOX}
      dataset={API_DESIGN_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default ApiDesignSvgRoadmap;
