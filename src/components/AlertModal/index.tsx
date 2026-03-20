import * as Alert from "@radix-ui/react-alert-dialog";
import { X } from "phosphor-react";
import type { ReactNode } from "react";

type AlertModalProps = {
  title: string;
  children: ReactNode;
};

export function AlertModal({ title, children }: AlertModalProps) {
  return (
    <Alert.Portal>
      <Alert.Overlay className="bg-zinc-900/60 fixed top-0 left-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center">
        <Alert.Content className="bg-zinc-200 text-zinc-900 w-[50%] p-4 rounded-md">
          <header className="mb-8 flex justify-between">
            <Alert.Title className="font-bold">{title}</Alert.Title>
            <Alert.Cancel className="cursor-pointer">
              <X className="text-red-400" size={18} weight="bold" />
            </Alert.Cancel>
          </header>
          {children}
        </Alert.Content>
      </Alert.Overlay>
    </Alert.Portal>
  );
}
