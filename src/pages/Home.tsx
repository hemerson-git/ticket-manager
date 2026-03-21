import {
  DownloadSimple,
  Export,
  GearSix,
  Plus,
  Password,
  Info,
} from "phosphor-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
import { ChangePassForm } from "../components/ChangePassForm";
import { About } from "../components/About";
import { TicketProvider } from "../contexts/TicketContext";
import { useTickets } from "../hooks/TicketContext";
import { useUserContext } from "../hooks/UserContext";

type PendingAction = "export" | "import" | null;

function HomeHeader() {
  const { tickets } = useTickets();
  const { state: userState, action } = useUserContext();
  const [settingsToast, setSettingsToast] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [changePassToast, setChangePassToast] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
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

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Header.button title="Configurações">
              <GearSix size={16} />
            </Header.button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[160px] rounded-md bg-zinc-800 p-1 shadow-xl border border-zinc-700 text-zinc-100 text-sm"
            >
              <DropdownMenu.Item
                onSelect={() => setTimeout(() => setSettingsOpen(true), 0)}
                className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer outline-none hover:bg-zinc-700 select-none"
              >
                <GearSix size={14} /> Configurações
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => setTimeout(() => setChangePassOpen(true), 0)}
                className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer outline-none hover:bg-zinc-700 select-none"
              >
                <Password size={14} /> Alterar Senha
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => setTimeout(() => setAboutOpen(true), 0)}
                className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer outline-none hover:bg-zinc-700 select-none"
              >
                <Info size={14} /> Sobre
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
          <Modal title="Configurações" className="min-w-0 w-[200px]">
            <Settings onSaved={() => { setSettingsOpen(false); setSettingsToast(true); }} />
          </Modal>
        </Dialog.Root>

        <Dialog.Root open={changePassOpen} onOpenChange={setChangePassOpen}>
          <Modal title="Alterar Senha" className="min-w-0 w-[320px]">
            <ChangePassForm
              onSaved={() => { setChangePassOpen(false); setChangePassToast(true); }}
            />
          </Modal>
        </Dialog.Root>

        <Dialog.Root open={aboutOpen} onOpenChange={setAboutOpen}>
          <Modal title="Sobre" className="min-w-0 w-[300px]">
            <About />
          </Modal>
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

    <Toast
      title="Senha"
      description="Senha alterada com sucesso!"
      isOpen={changePassToast}
      onOpenChange={setChangePassToast}
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
