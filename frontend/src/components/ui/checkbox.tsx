import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onCheckedChange) onCheckedChange(e.target.checked);
    };

    return (
      <div className="relative inline-flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="peer absolute inset-0 opacity-0 size-4 cursor-pointer z-10"
          {...props}
        />
        <div
          className={cn(
            "size-4 rounded-sm border border-zinc-800 bg-zinc-950 flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-700 peer-checked:bg-white peer-checked:border-white peer-checked:text-zinc-950",
            className
          )}
        >
          {checked && <Check className="size-3 stroke-[3]" />}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
