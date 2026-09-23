import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { FORWARD_DEPLOYED_ENGINEER_SVG_DATASET, FORWARD_DEPLOYED_ENGINEER_SVG_VIEWBOX } from '../../data/forwardDeployedEngineerSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const ForwardDeployedEngineerSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="forward-deployed-engineer"
      title="Forward Deployed Engineer Roadmap"
      viewBox={FORWARD_DEPLOYED_ENGINEER_SVG_VIEWBOX}
      dataset={FORWARD_DEPLOYED_ENGINEER_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default ForwardDeployedEngineerSvgRoadmap;
