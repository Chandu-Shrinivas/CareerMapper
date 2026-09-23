import React from 'react';
import { Award, CheckCircle2, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Badge } from '../ui/badge';

interface ReadinessBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readiness: any;
  jobTitle: string;
  company: string;
}

export const ReadinessBreakdownModal: React.FC<ReadinessBreakdownModalProps> = ({
  open,
  onOpenChange,
  readiness = {},
  jobTitle,
  company
}) => {
  const overall = readiness.overallReadiness ?? 50;
  const critical = readiness.criticalReadiness ?? 50;
  const required = readiness.requiredReadiness ?? 50;
  const preferred = readiness.preferredReadiness ?? 50;

  const matched = readiness.matchedRequirements || [];
  const missing = readiness.missingRequirements || [];
  const partial = readiness.partialRequirements || [];

  const criticalGaps = missing.filter((r: any) => r.importance === 'critical');
  const requiredGaps = missing.filter((r: any) => r.importance === 'required');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-zinc-950 border border-zinc-800 text-white rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-2 border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase">
              DETERMINISTIC READINESS ENGINE
            </Badge>
          </div>
          <DialogTitle className="text-xl font-black flex items-center justify-between">
            <span>Readiness Score Breakdown ({overall}%)</span>
            <span className="font-mono text-emerald-400 text-2xl flex items-center gap-1">
              <Award className="size-6 text-emerald-400" />
              {overall}%
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Transparent breakdown for <strong>{jobTitle}</strong> at <strong>{company}</strong> calculated based on job requirement importance weights (Critical=3.0, Required=2.0, Preferred=1.0, Nice-to-have=0.5).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Readiness Pillars */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Critical Readiness</span>
              <span className="font-mono text-lg font-black text-white">{critical}%</span>
            </div>
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Required Readiness</span>
              <span className="font-mono text-lg font-black text-white">{required}%</span>
            </div>
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Preferred Readiness</span>
              <span className="font-mono text-lg font-black text-white">{preferred}%</span>
            </div>
          </div>

          {/* Critical Gaps Section */}
          {criticalGaps.length > 0 && (
            <div className="space-y-2 p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle className="size-4 text-rose-400" />
                Critical Skill Gaps ({criticalGaps.length})
              </span>
              <p className="text-[11px] text-rose-300/80 leading-relaxed">
                These critical job requirements must be prepared before interview evaluation:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {criticalGaps.map((req: any) => (
                  <Badge key={req.id || req.name} variant="outline" className="border-rose-500/40 text-rose-300 bg-rose-500/10 text-xs py-1 px-2.5">
                    🔴 {req.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Required Gaps Section */}
          {requiredGaps.length > 0 && (
            <div className="space-y-2 p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="size-4 text-amber-400" />
                Required Skill Gaps ({requiredGaps.length})
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {requiredGaps.map((req: any) => (
                  <Badge key={req.id || req.name} variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10 text-xs py-1 px-2.5">
                    ⚠️ {req.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Matched Requirements */}
          <div className="space-y-2 p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="size-4 text-emerald-400" />
              Matched Requirements ({matched.length})
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {matched.length > 0 ? (
                matched.map((req: any) => (
                  <Badge key={req.id || req.name} variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-500/10 text-xs py-1 px-2.5">
                    <CheckCircle2 className="size-3 text-emerald-400 mr-1 inline" /> {req.name || req}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-zinc-500 italic">No skills matched yet. Complete roadmap topics to build readiness!</span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
