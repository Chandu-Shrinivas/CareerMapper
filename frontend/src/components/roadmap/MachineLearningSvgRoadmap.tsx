import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { MACHINE_LEARNING_SVG_DATASET, MACHINE_LEARNING_SVG_VIEWBOX } from '../../data/machineLearningSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const MachineLearningSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="machine-learning"
      title="Machine Learning"
      viewBox={MACHINE_LEARNING_SVG_VIEWBOX}
      dataset={MACHINE_LEARNING_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
    />
  );
};

export default MachineLearningSvgRoadmap;
