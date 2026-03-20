import type { ButtonHTMLAttributes, ReactNode } from "react";

type TableButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function TableButton({ children, ...props }: TableButtonProps) {
  return (
    <button
      {...props}
      className="cursor-pointer rounded-sm border border-zinc-500 p-1 transition-colors hover:border-purple-400 hover:text-purple-400"
    >
      {children}
    </button>
  );
}
