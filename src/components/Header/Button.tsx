import { forwardRef, type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export const HeaderButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={`flex rounded-sm border border-zinc-600 p-2 text-zinc-300 transition-colors hover:border-purple-500 hover:text-purple-400 ${className ?? ""}`}
    />
  )
);

HeaderButton.displayName = "HeaderButton";
