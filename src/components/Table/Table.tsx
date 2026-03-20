import type { ReactNode } from "react";

export function CustomTable({ children }: { children: ReactNode }) {
  return <table className="w-full table-auto text-sm">{children}</table>;
}
