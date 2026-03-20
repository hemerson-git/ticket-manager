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
      <Dialog.Overlay
        className={`
          fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-zinc-900/30 
          backdrop-blur-md ${className}
        `}
      >
        <Dialog.Content className="min-w-[50vw] rounded-md bg-zinc-200 p-4 pb-2 text-zinc-900">
          <header className="mb-8 flex justify-between">
            <Dialog.Title className="font-bold">{title}</Dialog.Title>

            <Dialog.Close className="cursor-pointer">
              <X className="text-red-400" size={18} weight="bold" />
            </Dialog.Close>
          </header>

          <Dialog.Description />
          {children}
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}
