import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash, CopySimple } from "phosphor-react";
import { Modal } from "../Modal";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FormNewTicket } from "../FormNewTicket";
import { FormEditTicket } from "../FormEditTicket";
import { AlertModal } from "../AlertModal";
import { Toast } from "../Toast";
import { ReactToPrint } from "../ReactToPrint";
import { useTickets } from "../../hooks/TicketContext";
import { Button } from "../Button";

export type TicketProps = {
  id: string;
  document_number: string;
  expiry_date: Date;
  is_paid: boolean;
  payment_place: string;
  recipient: string;
  value: number;
};

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TicketList() {
  // const [tickets, setTickets] = useState<TicketProps[]>([]);
  const { tickets } = useTickets();

  const [editModalData, setEditModalData] = useState<TicketProps | null>(null);
  const [deleteModalData, setDeleteModalData] = useState<TicketProps | null>(
    null
  );
  const [isToastOpen, setIsToastOpen] = useState(false);
  const TOTAL_PRICE = tickets.reduce(
    (buffer, ticket) => (buffer += ticket.value / 100),
    0
  );

  const timerRef = useRef<any>(0);

  async function getTickets() {
    const res = await (window as any).ticket.listTicket();
    // setTickets(res);
  }

  function handleEditTicket(ticket: TicketProps) {
    setEditModalData(ticket);
  }

  async function handleDeleteTicket(ticket: TicketProps) {
    setDeleteModalData(ticket);
  }

  async function confirmTicketDelete() {
    await (window as any).ticket.deleteTicket(deleteModalData);
    location.reload();
  }

  async function handleTogglePayment(ticket: TicketProps) {
    const userId = "3469ca96-4517-474c-8001-8363da836c5e";
    const isPaid = !ticket.is_paid;

    const newTicket = {
      id: ticket.id,
      recipient: ticket.recipient,
      ticketNumber: ticket.document_number,
      ticketValue: ticket.value,
      paymentPlace: ticket.payment_place,
      isPaid,
      expiryDate: ticket.expiry_date.toISOString().slice(0, 10),
      userId,
    };

    await (window as any).ticket.editTicket(newTicket);

    location.reload();
  }

  // useEffect(() => {
  //   getTickets();
  // }, []);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex flex-1 justify-between pr-4">
          <h1 className="text-lg font-bold ">TicketList</h1>
          <ReactToPrint tickets={tickets} />
        </div>

        <Dialog.Root modal>
          <div>
            <Dialog.Trigger asChild>
              <Button>
                <Plus />
                Cria Novo
              </Button>
            </Dialog.Trigger>
          </div>

          <Modal title="Adicionar novo boleto">
            <FormNewTicket />
          </Modal>
        </Dialog.Root>
      </div>

      <table border={1} className="border-gray-50">
        <thead>
          <tr className="">
            <td className="whitespace-nowrap font-bold px-4">Editar</td>

            <td className="whitespace-nowrap font-bold px-4">Excluir</td>

            <td className="whitespace-nowrap font-bold px-4">Beneficiário</td>
            <td className="whitespace-nowrap font-bold px-4">
              Número do documento
            </td>
            <td className="whitespace-nowrap font-bold px-4">
              Data de vencimento
            </td>
            <td className="whitespace-nowrap font-bold px-4">Valor</td>
            <td className="whitespace-nowrap font-bold px-4">
              Local de pagamento
            </td>
            <td className="whitespace-nowrap font-bold px-4">Pago</td>
          </tr>
        </thead>
        <Dialog.Root>
          <AlertDialog.Root>
            <tbody>
              {tickets.map((ticket) => {
                const date = dateFormat.format(new Date(ticket.expiry_date));

                return (
                  <tr key={ticket.id}>
                    <td className="flex items-center justify-center">
                      <Dialog.Trigger onClick={() => handleEditTicket(ticket)}>
                        <Pencil />
                      </Dialog.Trigger>
                    </td>

                    <td align="center">
                      <AlertDialog.Trigger
                        onClick={() => handleDeleteTicket(ticket)}
                      >
                        <Trash />
                      </AlertDialog.Trigger>
                    </td>

                    <td className="px-4">{ticket.recipient}</td>

                    <td className="px-4">
                      <div className="w-[240px] flex items-center gap-2 overflow-hidden">
                        <button
                          type="button"
                          title="Copiar para o Clipboard"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              ticket.document_number
                            );

                            clearTimeout(timerRef.current);
                            timerRef.current = setTimeout(() => {
                              setIsToastOpen(true);
                            }, 2000);
                          }}
                        >
                          <CopySimple />
                        </button>

                        <p className="line-clamp-1">
                          {ticket.document_number.slice(0, 24)}
                          {ticket.document_number.length > 24 && "..."}
                        </p>
                      </div>
                    </td>

                    <td className="px-4">
                      <time>{date}</time>
                    </td>

                    <td className="px-4">
                      {priceFormatter.format(ticket.value / 100)}
                    </td>

                    <td className="px-4">{ticket.payment_place}</td>

                    <td className="px-4 py-2 flex justify-center items-center">
                      <input
                        type="checkbox"
                        name="is_paid"
                        id="is_paid"
                        checked={ticket.is_paid}
                        onChange={() => handleTogglePayment(ticket)}
                        className="text-purple-500 rounded-sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <Modal title="Editar Boleto">
              {editModalData && <FormEditTicket ticket={editModalData} />}
            </Modal>

            {deleteModalData && (
              <AlertModal
                title="Deletar boleto?"
                onConfirm={confirmTicketDelete}
              >
                O Boleto de nº{" "}
                <span className="font-bold">
                  {deleteModalData.document_number}
                </span>
                , do beneficiário{" "}
                <span className="font-bold">{deleteModalData.recipient}</span>{" "}
                será apagado de forma permanente, você deseja continuar?
              </AlertModal>
            )}
          </AlertDialog.Root>
        </Dialog.Root>
      </table>

      <footer className="fixed bottom-0 left-0 w-full p-4 flex flex-1 justify-end">
        <span>Total: {priceFormatter.format(TOTAL_PRICE)}</span>
      </footer>

      <Toast
        title="Copiado!"
        description="Texto Copiado para a área de transferência"
        isOpen={isToastOpen}
        onOpenChange={setIsToastOpen}
      />
    </div>
  );
}
