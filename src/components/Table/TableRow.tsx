import type { ReactNode } from "react";

type BodyRowProps = {
  children: ReactNode;
  isOdd: number;
};

export function BodyRow({ children, isOdd }: BodyRowProps) {
  return (
    <tr
      className={`${
        isOdd % 2 === 0 ? "bg-purple-800/40" : "bg-purple-900/10"
      } text-zinc-100`}
    >
      {children}
    </tr>
  );
}
