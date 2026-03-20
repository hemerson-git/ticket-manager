import {
  DownloadSimple,
  Export,
  GearSix,
  Plus,
} from "phosphor-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Header from "../components/Header";
import { Filter } from "../components/Filter";
import { TicketList } from "../components/TicketList";
import { Modal } from "../components/Modal";
import { Settings } from "../components/Settings";
import { FormNewTicket } from "../components/FormNewTicket";
import { ReactToPrint } from "../components/ReactToPrint";
import { Toast } from "../components/Toast";
import { TicketProvider } from "../contexts/TicketContext";
import { useTickets } from "../hooks/TicketContext";
import { useUserContext } from "../hooks/UserContext";

function HomeHeader() {
  const { tickets } = useTickets();
  const { state: userState, action } = useUserContext();
  const [settingsToast, setSettingsToast] = useState(false);

  async function handleExportDatabase() {
    await window.DATABASE.EXPORT_DATABASE();
  }

  async function handleImportDatabase() {
    const resp = await window.DATABASE.IMPORT_DATABASE();
    if (resp) location.reload();
  }

  return (
    <Header.wrapper title="Boletos">
      <Header.navigation>
        <ReactToPrint tickets={tickets} />

        <Dialog.Root modal>
          <Modal title="Adicionar novo boleto">
            <FormNewTicket />
          </Modal>
          <Dialog.Trigger asChild>
            <Header.button title="Adicionar boleto">
              <Plus size={16} />
            </Header.button>
          </Dialog.Trigger>
        </Dialog.Root>

        <Dialog.Root>
          <Modal title="Configurações" className="min-w-0 w-[300px]">
            <Settings onSaved={() => setSettingsToast(true)} />
          </Modal>
          <Dialog.Trigger asChild>
            <Header.button title="Configurações">
              <GearSix size={16} />
            </Header.button>
          </Dialog.Trigger>
        </Dialog.Root>

        <Header.button onClick={handleExportDatabase} title="Exportar banco de dados">
          <Export size={16} />
        </Header.button>

        <Header.button onClick={handleImportDatabase} title="Importar banco de dados">
          <DownloadSimple size={16} />
        </Header.button>

        <Header.user
          name={userState.user.name}
          email={userState.user.email}
          avatarUrl={userState.user.avatarUrl}
          onSignOut={action.signOut}
        />
      </Header.navigation>
    </Header.wrapper>

    <Toast
      title="Configurações"
      description="Items por página atualizado!"
      isOpen={settingsToast}
      onOpenChange={setSettingsToast}
    />
  );
}

export function Home() {
  return (
    <TicketProvider>
      <HomeHeader />
      <div className="p-4">
        <Filter />
        <TicketList />
      </div>
    </TicketProvider>
  );
}
