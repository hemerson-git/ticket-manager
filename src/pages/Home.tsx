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
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { TicketProvider } from "../contexts/TicketContext";
import { useTickets } from "../hooks/TicketContext";
import { useUserContext } from "../hooks/UserContext";

type PendingAction = "export" | "import" | null;

function HomeHeader() {
  const { tickets } = useTickets();
  const { state: userState, action } = useUserContext();
  const [settingsToast, setSettingsToast] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handlePasswordConfirm() {
    const isValid = await window.CONFIGS.COMPARE_PASS(password);

    if (!isValid) {
      setPasswordError("Senha incorreta");
      return;
    }

    setPasswordError("");
    setPendingAction(null);
    setPassword("");

    if (pendingAction === "export") {
      await window.DATABASE.EXPORT_DATABASE();
    } else if (pendingAction === "import") {
      const resp = await window.DATABASE.IMPORT_DATABASE();
      if (resp) location.reload();
    }
  }

  function handleOpenPasswordDialog(action: PendingAction) {
    setPassword("");
    setPasswordError("");
    setPendingAction(action);
  }

  return (<>
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
          <Modal title="Configurações" className="min-w-0 w-[140px]">
            <Settings onSaved={() => setSettingsToast(true)} />
          </Modal>
          <Dialog.Trigger asChild>
            <Header.button title="Configurações">
              <GearSix size={16} />
            </Header.button>
          </Dialog.Trigger>
        </Dialog.Root>

        <Header.button onClick={() => handleOpenPasswordDialog("export")} title="Exportar banco de dados">
          <Export size={16} />
        </Header.button>

        <Header.button onClick={() => handleOpenPasswordDialog("import")} title="Importar banco de dados">
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

    <Dialog.Root open={!!pendingAction} onOpenChange={(open) => { if (!open) { setPendingAction(null); setPassword(""); setPasswordError(""); } }}>
      <Modal title={pendingAction === "export" ? "Exportar banco de dados" : "Importar banco de dados"} className="min-w-0 w-[300px]">
        <div className="flex flex-col gap-4">
          <Input
            id="db-password"
            label="Senha"
            type="password"
            value={password}
            error={passwordError}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handlePasswordConfirm(); }}
            autoFocus
          />
          <footer className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => setPendingAction(null)}>Cancelar</Button>
            <Button onClick={handlePasswordConfirm}>Confirmar</Button>
          </footer>
        </div>
      </Modal>
    </Dialog.Root>

    <Toast
      title="Configurações"
      description="Items por página atualizado!"
      isOpen={settingsToast}
      onOpenChange={setSettingsToast}
    />
  </>);
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
