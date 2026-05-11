import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({ className = "", checked, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={className}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  );
}
