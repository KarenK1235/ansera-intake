import React from "react";

export function Tooltip({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
}

export function TooltipContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
