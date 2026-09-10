import React from 'react';

interface RoadmapProgressDonutChartProps {
  done: number;
  learning: number;
  skipped: number;
  notStarted: number;
  total: number;
  percentage: number;
  isComplete?: boolean;
  size?: number;
  strokeWidth?: number;
}

export const RoadmapProgressDonutChart: React.FC<RoadmapProgressDonutChartProps> = ({
  done,
  learning,
  skipped,
  notStarted,
  total,
  percentage,
  isComplete = false,
  size = 110,
  strokeWidth = 12
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const safeTotal = total > 0 ? total : 1;

  const doneAngle = (done / safeTotal) * circumference;
  const learningAngle = (learning / safeTotal) * circumference;
  const skippedAngle = (skipped / safeTotal) * circumference;
  const notStartedAngle = (notStarted / safeTotal) * circumference;

  // Segments offsets
  const doneOffset = 0;
  const learningOffset = -doneAngle;
  const skippedOffset = -(doneAngle + learningAngle);
  const notStartedOffset = -(doneAngle + learningAngle + skippedAngle);

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background Base Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#18181b"
          strokeWidth={strokeWidth}
        />

        {/* Not Started Segment */}
        {notStarted > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth={strokeWidth}
            strokeDasharray={`${notStartedAngle} ${circumference}`}
            strokeDashoffset={notStartedOffset}
            className="transition-all duration-300"
          />
        )}

        {/* Skipped Segment */}
        {skipped > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#71717a"
            strokeWidth={strokeWidth}
            strokeDasharray={`${skippedAngle} ${circumference}`}
            strokeDashoffset={skippedOffset}
            className="transition-all duration-300"
          />
        )}

        {/* Learning Segment */}
        {learning > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#a855f7"
            strokeWidth={strokeWidth}
            strokeDasharray={`${learningAngle} ${circumference}`}
            strokeDashoffset={learningOffset}
            className="transition-all duration-300"
          />
        )}

        {/* Done Segment */}
        {done > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${doneAngle} ${circumference}`}
            strokeDashoffset={doneOffset}
            className="transition-all duration-300"
          />
        )}
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
        <span className="text-base font-extrabold text-white tracking-tight leading-none">
          {percentage}%
        </span>
        <span className="text-[9px] font-medium text-zinc-400 mt-0.5 leading-none">
          {isComplete ? 'Done' : 'Complete'}
        </span>
      </div>
    </div>
  );
};
