import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { TECHNICAL_WRITER_SVG_DATASET, TECHNICAL_WRITER_SVG_VIEWBOX } from '../../data/technicalWriterSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const TechnicalWriterSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="technical-writer"
      title="Technical Writer"
      viewBox={TECHNICAL_WRITER_SVG_VIEWBOX}
      dataset={TECHNICAL_WRITER_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default TechnicalWriterSvgRoadmap;
