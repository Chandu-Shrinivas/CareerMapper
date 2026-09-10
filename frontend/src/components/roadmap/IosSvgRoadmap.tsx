import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { IOS_SVG_DATASET, IOS_SVG_VIEWBOX } from '../../data/iosSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const IosSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="ios"
      title="iOS Developer"
      viewBox={IOS_SVG_VIEWBOX}
      dataset={IOS_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default IosSvgRoadmap;
