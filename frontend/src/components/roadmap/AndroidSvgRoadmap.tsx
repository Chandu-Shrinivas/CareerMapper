import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { ANDROID_SVG_DATASET, ANDROID_SVG_VIEWBOX } from '../../data/androidSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const AndroidSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="android"
      title="Android Developer"
      viewBox={ANDROID_SVG_VIEWBOX}
      dataset={ANDROID_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    
      selectedNodeId={selectedNodeId}
    />
  );
};

export default AndroidSvgRoadmap;
