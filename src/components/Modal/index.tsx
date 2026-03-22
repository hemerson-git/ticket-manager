import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
  className?: string;
};

export function Modal({ children, title, className }: Props) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <Dialog.Content
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col max-h-[90vh] min-w-[200px] rounded-md bg-zinc-800 p-6 text-zinc-100 shadow-xl ${className ?? ""}`}
      >
        <header className="mb-8 flex justify-between">
          <Dialog.Title className="font-bold">{title}</Dialog.Title>

          <Dialog.Close className="cursor-pointer">
            <X className="text-red-400" size={18} weight="bold" />
          </Dialog.Close>
        </header>

        <Dialog.Description />
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
