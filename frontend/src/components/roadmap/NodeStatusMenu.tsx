import React from 'react';
import { BookOpen, Check, X } from 'lucide-react';
import type { NodeStatus } from '../../services/RoadmapProgressStore';

interface NodeStatusMenuProps {
  currentStatus: NodeStatus;
  onSelectStatus: (status: 'learning' | 'done' | 'skipped', e: React.MouseEvent) => void;
  position: { top: number; left: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const NodeStatusMenu: React.FC<NodeStatusMenuProps> = ({
  currentStatus,
  onSelectStatus,
  position,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute z-50 transition-opacity duration-150 ease-in-out pointer-events-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -100%)',
        marginBottom: '6px'
      }}
    >
      <div className="flex items-center bg-white border-2 border-black rounded-lg shadow-xl overflow-hidden divide-x divide-zinc-200 text-xs font-sans select-none">
        {/* Learning Button */}
        <button
          type="button"
          onClick={(e) => onSelectStatus('learning', e)}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold transition-colors cursor-pointer ${
            currentStatus === 'learning'
              ? 'bg-[#874efe] text-white'
              : 'bg-white text-zinc-800 hover:bg-purple-50 hover:text-[#874efe]'
          }`}
        >
          <BookOpen className={`size-3.5 ${currentStatus === 'learning' ? 'text-white' : 'text-[#874efe]'}`} />
          <span>Learning</span>
        </button>

        {/* Done Button */}
        <button
          type="button"
          onClick={(e) => onSelectStatus('done', e)}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold transition-colors cursor-pointer ${
            currentStatus === 'done'
              ? 'bg-[#00a843] text-white'
              : 'bg-white text-zinc-800 hover:bg-emerald-50 hover:text-[#00a843]'
          }`}
        >
          <Check className={`size-3.5 ${currentStatus === 'done' ? 'text-white' : 'text-[#00a843]'}`} />
          <span>Done</span>
        </button>

        {/* Skip Button */}
        <button
          type="button"
          onClick={(e) => onSelectStatus('skipped', e)}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-bold transition-colors cursor-pointer ${
            currentStatus === 'skipped'
              ? 'bg-[#4b4d58] text-white'
              : 'bg-white text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
        >
          <X className={`size-3.5 ${currentStatus === 'skipped' ? 'text-white' : 'text-zinc-500'}`} />
          <span>Skip</span>
        </button>
      </div>
    </div>
  );
};

export default NodeStatusMenu;
