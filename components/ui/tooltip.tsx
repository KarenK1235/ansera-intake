import React from "react";

export function Tooltip({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({
  className = "",
  children,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
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
