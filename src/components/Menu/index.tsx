import { useState } from "react";
import {
  List,
  X,
  DownloadSimple,
  Export,
  ArrowClockwise,
  GearSix,
} from "phosphor-react";
import { useTickets } from "../../hooks/TicketContext";
import { Button } from "../Button";
import { UserProfile } from "../Profile";
import { useUserContext } from "../../hooks/UserContext";
import { Toast } from "../Toast";
import * as Dialog from "@radix-ui/react-dialog";
import { Modal } from "../Modal";
import { Settings } from "../Settings";
import { Options } from "./options";
import { OptionsButton, OptionsButtonIcon } from "./button";

export function Menu() {
  const { loadTickets } = useTickets();
  const { state: userState } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  function handleToggleMenu() {
    setIsOpen((prevState) => !prevState);
  }

  async function handleExportDatabase() {
    await (window as any).database.exportDatabase();
  }

  async function handleImportDatabase() {
    const resp = await (window as any).database.importDatabase();
    if (resp) location.reload();
  }

  function handleRefreshTickets() {
    loadTickets();
    setIsToastOpen(true);
  }

  return (
    <div className="mb-4 flex flex-col px-3">
      <Options>
        <div className="flex gap-2">
          <OptionsButton onClick={handleToggleMenu}>
            {isOpen ? (
              <OptionsButtonIcon icon={X} />
            ) : (
              <OptionsButtonIcon icon={List} />
            )}
          </OptionsButton>

          <OptionsButton
            onClick={handleRefreshTickets}
            title="Recarregar página"
          >
            <OptionsButtonIcon icon={ArrowClockwise} />
          </OptionsButton>

          <Dialog.Root>
            <Modal title="Configurações">
              <Settings />
            </Modal>

            <Dialog.Trigger
              className="rounded-sm border border-zinc-400 px-2"
              title="Configurações"
              aria-label="Abrir modal de configurações do aplicativo"
            >
              <GearSix />
            </Dialog.Trigger>
          </Dialog.Root>
        </div>

        <UserProfile user={userState.user} />
      </Options>

      {isOpen && (
        <div
          className="
            absolute -left-8 top-14 ml-10 flex flex-col w-[calc(100%_-_20px)] flex-1
            justify-between gap-3 rounded-md bg-zinc-700 px-4 py-2 z-10"
        >
          <div className="flex items-center gap-4">
            <Button onClick={handleExportDatabase}>
              Exportar
              <Export />
            </Button>

            <Button onClick={handleImportDatabase}>
              Importar
              <DownloadSimple />
            </Button>
          </div>
        </div>
      )}

      <Toast
        description="Lista Atualizada"
        isOpen={isToastOpen}
        onOpenChange={setIsToastOpen}
      />
    </div>
  );
}
