import type { InputHTMLAttributes } from "react";
import InputMask from "react-input-mask";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  mask?: string;
  error?: string;
};

export function Input({ label, id, mask, error, ...rest }: Props) {
  const isCheckbox = rest.type === "checkbox";

  return (
    <div className={`flex w-full flex-1 items-start gap-1 ${isCheckbox ? "flex-row items-center" : "flex-col"}`}>
      {label && !isCheckbox && (
        <label
          htmlFor={id}
          className="inline-flex select-none whitespace-nowrap text-sm font-semibold"
        >
          {label}
        </label>
      )}

      <div
        className={`relative flex flex-col ${
          !isCheckbox ? "w-full flex-1" : "h-4 w-4 shrink-0 p-0"
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
            className={`bg-transparent text-zinc-100 focus:outline-0 ${
              rest.type === "checkbox"
                ? "h-4 w-4 cursor-pointer rounded-sm border-2 border-purple-500 checked:bg-purple-500 checked:border-purple-500"
                : "border-0 border-b-2 border-purple-500 px-2 py-1"
            } ${error ? "border-b-red-400" : ""} ${rest.className ?? ""}`}
          />
        )}

        {error && (
          <span className="mt-1 text-xs text-red-500">
            {error}
          </span>
        )}
      </div>

      {label && isCheckbox && (
        <label
          htmlFor={id}
          className="inline-flex select-none whitespace-nowrap text-sm font-semibold"
        >
          {label}
        </label>
      )}
    </div>
  );
}
