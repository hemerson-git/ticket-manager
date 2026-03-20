import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function HeaderNavigation({ children, className }: Props) {
  return (
    <nav className={`flex items-center gap-2 ${className ?? ""}`}>
      {children}
    </nav>
  );
}
