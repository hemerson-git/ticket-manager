import type { ReactNode, TdHTMLAttributes } from "react";

type TableDataProps = TdHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
};

export function TableData({ children, className, ...props }: TableDataProps) {
  return (
    <td
      className={`whitespace-nowrap px-2 py-2 text-center align-middle ${className ?? ""}`}
      {...props}
    >
      {children}
    </td>
  );
}
