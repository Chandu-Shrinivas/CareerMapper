import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { UX_DESIGN_SVG_DATASET, UX_DESIGN_SVG_VIEWBOX } from '../../data/uxDesignSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const UxDesignSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="ux-design"
      title="UX Design"
      viewBox={UX_DESIGN_SVG_VIEWBOX}
      dataset={UX_DESIGN_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default UxDesignSvgRoadmap;
