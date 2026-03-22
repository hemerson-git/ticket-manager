import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { variants } from "./styles";
import { Spinner } from "phosphor-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: keyof typeof variants;
  isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { asChild, children, className, variant = "primary", isLoading, ...props },
    ref
  ) {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        {...props}
        className={`flex items-center gap-2 rounded-sm border px-4 py-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className ?? ""} ${
          variants[variant]
        } ${isLoading ? "!cursor-not-allowed opacity-30 relative" : ""}`}
      >
        {isLoading ? (
          <span>
            <Spinner className="animate-spin absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
            <span className="invisible">{children}</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
