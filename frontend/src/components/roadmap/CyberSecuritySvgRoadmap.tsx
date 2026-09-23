import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { CYBER_SECURITY_SVG_DATASET, CYBER_SECURITY_SVG_VIEWBOX } from '../../data/cyberSecuritySvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const CyberSecuritySvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="cyber-security"
      title="Cyber Security Expert"
      viewBox={CYBER_SECURITY_SVG_VIEWBOX}
      dataset={CYBER_SECURITY_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default CyberSecuritySvgRoadmap;
