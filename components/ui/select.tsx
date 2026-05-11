import React from "react";

type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
};

export function Select({ children }: SelectProps) {
  return <>{children}</>;
}

export function SelectTrigger({
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

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({
  value,
  children
}: {
  value: string;
  children?: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}
