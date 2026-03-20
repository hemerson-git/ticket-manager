import * as Alert from "@radix-ui/react-alert-dialog";
import { useTickets } from "../../hooks/TicketContext";
import { Button } from "../Button";

type DeleteTicketAlertProps = {
  ticketId: string;
};

export function DeleteTicketAlert({ ticketId }: DeleteTicketAlertProps) {
  const { deleteTicket } = useTickets();

  const handleDelete = async () => {
    await deleteTicket(ticketId);
  };

  return (
    <>
      <Alert.Description>
        Deseja Realmente Deletar o Boleto? <br />
        Essa ação é irrevessível
      </Alert.Description>

      <footer className="flex justify-end gap-2 mt-4">
        <Alert.Cancel asChild>
          <Button variant="danger">Cancelar</Button>
        </Alert.Cancel>

        <Alert.Action onClick={handleDelete} asChild>
          <Button variant="primary">Confirmar</Button>
        </Alert.Action>
      </footer>
    </>
  );
}
