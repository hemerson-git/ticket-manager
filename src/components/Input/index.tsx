import type { InputHTMLAttributes } from "react";
import InputMask from "react-input-mask";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  mask?: string;
  error?: string;
};

export function Input({ label, id, mask, error, ...rest }: Props) {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-1">
      {label && (
        <label
          htmlFor={id}
          className="inline-flex select-none whitespace-nowrap text-sm font-semibold"
        >
          {label}
        </label>
      )}

      <div
        className={`relative flex flex-col ${
          rest.type !== "checkbox" ? "w-full flex-1" : "h-4 w-4 self-center p-0"
        }`}
      >
        {mask ? (
          <InputMask
            mask={mask}
            id={id}
            {...rest}
            className={`border-0 border-b-2 border-purple-500 bg-transparent py-1 text-zinc-100 focus:outline-0 ${
              rest.type !== "checkbox" ? "px-2" : ""
            } ${error ? "border-b-red-400" : ""} ${rest.className ?? ""}`}
          />
        ) : (
          <input
            id={id}
            {...rest}
            className={`border-0 border-b-2 border-purple-500 bg-transparent py-1 text-zinc-100 focus:outline-0 ${
              rest.type === "checkbox" ? "checked:text-purple-500" : "px-2"
            } ${error ? "border-b-red-400" : ""} ${rest.className ?? ""}`}
          />
        )}

        {error && (
          <span className="absolute right-0 top-full -translate-y-1/2 text-xs text-red-500">
            {error}!
          </span>
        )}
      </div>
    </div>
  );
}
