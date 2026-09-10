import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { MACHINE_LEARNING_SVG_DATASET, MACHINE_LEARNING_SVG_VIEWBOX } from '../../data/machineLearningSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const MachineLearningSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="machine-learning"
      title="Machine Learning"
      viewBox={MACHINE_LEARNING_SVG_VIEWBOX}
      dataset={MACHINE_LEARNING_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default MachineLearningSvgRoadmap;
