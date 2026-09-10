import React from 'react';
import { GenericSvgRoadmap } from './GenericSvgRoadmap';
import { POSTGRESQL_DBA_SVG_DATASET, POSTGRESQL_DBA_SVG_VIEWBOX } from '../../data/postgresqlDbaSvgData';

interface SvgRoadmapWrapperProps {
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const PostgreSqlDbaSvgRoadmap: React.FC<SvgRoadmapWrapperProps> = ({
  onNodeStatusChange,
  selectedNodeId
}) => {
  return (
    <GenericSvgRoadmap
      roadmapId="postgresql-dba"
      title="PostgreSQL DBA"
      viewBox={POSTGRESQL_DBA_SVG_VIEWBOX}
      dataset={POSTGRESQL_DBA_SVG_DATASET}
      onNodeStatusChange={onNodeStatusChange}
      selectedNodeId={selectedNodeId}
    />
  );
};

export default PostgreSqlDbaSvgRoadmap;
