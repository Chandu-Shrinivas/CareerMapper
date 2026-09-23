import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { BLOCKCHAIN_SVG_DATASET, BLOCKCHAIN_SVG_VIEWBOX } from '../../data/blockchainSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const BlockchainSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
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
