import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';

interface ResetProgressDialogProps {
  isOpen: boolean;
  roadmapTitle: string;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetProgressDialog: React.FC<ResetProgressDialogProps> = ({
  isOpen,
  roadmapTitle,
  onClose,
  onConfirmReset
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            Reset Progress for {roadmapTitle}?
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 mt-2">
            This will remove your Learning, Done, and Skipped statuses for this roadmap. This action cannot be undone. Other roadmaps will remain completely unchanged.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="text-xs bg-red-600 hover:bg-red-700 text-white"
          >
            Reset Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
