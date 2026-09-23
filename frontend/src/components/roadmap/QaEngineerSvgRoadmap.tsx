import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { QA_ENGINEER_SVG_DATASET, QA_ENGINEER_SVG_VIEWBOX } from '../../data/qaEngineerSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const QaEngineerSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="qa"
      title="QA Engineer"
      viewBox={QA_ENGINEER_SVG_VIEWBOX}
      dataset={QA_ENGINEER_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    
    />
  );
};

export default QaEngineerSvgRoadmap;
