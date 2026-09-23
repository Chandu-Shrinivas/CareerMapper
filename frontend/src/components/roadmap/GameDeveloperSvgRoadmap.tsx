import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { GAME_DEVELOPER_SVG_DATASET, GAME_DEVELOPER_SVG_VIEWBOX } from '../../data/gameDeveloperSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const GameDeveloperSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="game-developer"
      title="Game Developer"
      viewBox={GAME_DEVELOPER_SVG_VIEWBOX}
      dataset={GAME_DEVELOPER_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default GameDeveloperSvgRoadmap;
