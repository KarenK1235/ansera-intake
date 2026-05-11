import React from "react";

type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
};

export function RadioGroup({ className = "", children, ...props }: RadioGroupProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

type RadioGroupItemProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
};

export function RadioGroupItem({ className = "", value, ...props }: RadioGroupItemProps) {
  return <input type="radio" value={value} className={className} {...props} />;
}
