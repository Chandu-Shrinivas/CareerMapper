import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { SOFTWARE_ARCHITECT_SVG_DATASET, SOFTWARE_ARCHITECT_SVG_VIEWBOX } from '../../data/softwareArchitectSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const SoftwareArchitectSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="software-architect"
      title="Software Architect"
      viewBox={SOFTWARE_ARCHITECT_SVG_VIEWBOX}
      dataset={SOFTWARE_ARCHITECT_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    
    />
  );
};

export default SoftwareArchitectSvgRoadmap;
