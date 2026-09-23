import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { ENGINEERING_MANAGER_SVG_DATASET, ENGINEERING_MANAGER_SVG_VIEWBOX } from '../../data/engineeringManagerSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const EngineeringManagerSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="engineering-manager"
      title="Engineering Manager"
      viewBox={ENGINEERING_MANAGER_SVG_VIEWBOX}
      dataset={ENGINEERING_MANAGER_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default EngineeringManagerSvgRoadmap;
