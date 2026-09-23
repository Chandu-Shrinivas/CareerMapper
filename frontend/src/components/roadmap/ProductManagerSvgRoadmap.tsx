import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { PRODUCT_MANAGER_SVG_DATASET, PRODUCT_MANAGER_SVG_VIEWBOX } from '../../data/productManagerSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const ProductManagerSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  onSelectNode,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="product-manager"
      title="Product Manager"
      viewBox={PRODUCT_MANAGER_SVG_VIEWBOX}
      dataset={PRODUCT_MANAGER_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      onSelectNode={onSelectNode}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default ProductManagerSvgRoadmap;
