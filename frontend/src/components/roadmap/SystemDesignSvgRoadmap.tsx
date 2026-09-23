import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { SYSTEM_DESIGN_SVG_DATASET, SYSTEM_DESIGN_SVG_VIEWBOX } from '../../data/systemDesignSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const SystemDesignSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="system-design"
      title="System Design Roadmap"
      viewBox={SYSTEM_DESIGN_SVG_VIEWBOX}
      dataset={SYSTEM_DESIGN_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default SystemDesignSvgRoadmap;
