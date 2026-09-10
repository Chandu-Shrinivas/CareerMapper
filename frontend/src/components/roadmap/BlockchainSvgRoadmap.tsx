import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { BLOCKCHAIN_SVG_DATASET, BLOCKCHAIN_SVG_VIEWBOX } from '../../data/blockchainSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
}

export const BlockchainSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId,
  onSelectNode
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="blockchain"
      title="Blockchain Developer"
      viewBox={BLOCKCHAIN_SVG_VIEWBOX}
      dataset={BLOCKCHAIN_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
      onSelectNode={onSelectNode}
    />
  );
};

export default BlockchainSvgRoadmap;
