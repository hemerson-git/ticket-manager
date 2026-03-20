import { useEffect, useRef, useState } from "react";
import { Pencil, Trash, CopySimple, Repeat } from "phosphor-react";
import { Modal } from "../Modal";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FormEditTicket } from "../FormEditTicket";
import { DeleteTicketAlert } from "../DeleteTicketAlert";
import { Toast } from "../Toast";
import { useTickets } from "../../hooks/TicketContext";
import { useUserContext } from "../../hooks/UserContext";
import { defaultFilter } from "../../contexts/TicketContext";
// import configs from "../../../configs.json";

export type TicketProps = {
  id: string;
  document_number: string;
  expiry_date: Date;
  is_paid: boolean;
  payment_place: string;
  recipient: string;
  value: number;
  is_online: boolean;
  user: {
    name: string;
  };
};

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TicketList() {
  const { tickets, filter, page, totalPages, setFilter, setPage, saveTicket } = useTickets();
  const { state: userState } = useUserContext();
  const TOTAL_PAGES = Array(totalPages ?? 1).fill("");

  const [editModalData, setEditModalData] = useState<TicketProps | null>(null);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const TOTAL_PRICE =
    tickets?.length > 0
      ? tickets.reduce((buffer, ticket) => (buffer += ticket.value / 100), 0)
      : 0;

  const timerRef = useRef<any>(0);

  function handleEditTicket(ticket: TicketProps) {
    setEditModalData(ticket);
  }

  async function handleTogglePayment(ticket: TicketProps & { userId: string }) {
    const is_paid = !ticket.is_paid;

    const newTicket = {
      id: ticket.id,
      recipient: ticket.recipient,
      document_number: ticket.document_number,
      value: ticket.value,
      payment_place: ticket.payment_place,
      is_paid,
      is_online: ticket.is_online,
      expiry_date: ticket.expiry_date,
      userId: ticket.userId,
    };

    await saveTicket(newTicket);

    if (JSON.stringify(filter) !== JSON.stringify(defaultFilter)) {
      return setFilter(filter);
    }
  }

  async function handleToggleOnline(ticket: TicketProps & { userId: string }) {
    const is_online = !ticket.is_online;

    const newTicket = {
      id: ticket.id,
      recipient: ticket.recipient,
      document_number: ticket.document_number,
      value: ticket.value,
      payment_place: ticket.payment_place,
      is_paid: ticket.is_paid,
      is_online,
      expiry_date: ticket.expiry_date,
      userId: ticket.userId,
    };

    await saveTicket(newTicket);

    setFilter(filter, page);
  }

  async function handleChangePlace(
    place: string,
    ticket: TicketProps & { userId: string }
  ) {
    const editedTicket = {
      id: ticket.id,
      recipient: ticket.recipient,
      document_number: ticket.document_number,
      value: ticket.value,
      payment_place: place,
      is_paid: ticket.is_paid,
      is_online: ticket.is_online,
      expiry_date: ticket.expiry_date,
      userId: ticket.userId,
    };

    try {
      await saveTicket(editedTicket);
    } catch (err) {
      alert("Não foi possível salvar as alterações, tente novamente");
    }
  }

  async function handleDuplicateTicket(ticket: TicketProps) {
    const newTicket = {
      recipient: ticket.recipient,
      document_number: ticket.document_number,
      value: ticket.value,
      payment_place: ticket.payment_place,
      is_paid: ticket.is_paid,
      is_online: ticket.is_online,
      expiry_date: ticket.expiry_date,
      userId: userState.user.id,
    };

    await saveTicket(newTicket);
  }

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="max-h-[calc(100vh_-_140px)] overflow-auto pb-10">
      {tickets?.length ? (
        <>
          <table border={1} className="border-gray-50 text-sm">
            <thead>
              <tr className="">
                <td className="whitespace-nowrap px-2 font-bold">Editar</td>

                <td className="whitespace-nowrap px-2 font-bold">Excluir</td>

                <td className="whitespace-nowrap px-2 font-bold">Duplicar</td>

                <td className="whitespace-nowrap px-4 font-bold">
                  Beneficiário
                </td>
                <td className="whitespace-nowrap px-4 font-bold">
                  Nº do documento
                </td>
                <td className="whitespace-nowrap px-4 font-bold">Vencimento</td>
                <td className="whitespace-nowrap px-4 font-bold">Valor</td>
                <td className="whitespace-nowrap px-4 font-bold">
                  Local de pagamento
                </td>
                <td className="whitespace-nowrap px-4 font-bold">Pago</td>
                <td className="whitespace-nowrap px-4 font-bold">Online</td>
              </tr>
            </thead>

            <Dialog.Root>
                <tbody>
                  {tickets.map((ticket) => {
                    const date = dateFormat.format(
                      new Date(ticket.expiry_date)
                    );

                    return (
                      <tr key={ticket.id}>
                        <td align="center">
                          <Dialog.Trigger
                            onClick={() => handleEditTicket(ticket)}
                          >
                            <Pencil />
                          </Dialog.Trigger>
                        </td>

                        <td align="center">
                          <AlertDialog.Root>
                            <AlertDialog.Trigger>
                              <Trash />
                            </AlertDialog.Trigger>
                            <AlertDialog.Portal>
                              <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                              <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 p-6 shadow-xl w-[400px]">
                                <AlertDialog.Title className="text-lg font-bold mb-2">
                                  Deletar boleto?
                                </AlertDialog.Title>
                                <DeleteTicketAlert ticketId={ticket.id} />
                              </AlertDialog.Content>
                            </AlertDialog.Portal>
                          </AlertDialog.Root>
                        </td>

                        <td align="center">
                          <button onClick={() => handleDuplicateTicket(ticket)}>
                            <Repeat />
                          </button>
                        </td>

                        <td className="px-4">{ticket.recipient}</td>

                        <td className="px-4">
                          <div className="flex w-[120px] items-center gap-2 overflow-hidden">
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
                              {ticket.document_number.slice(0, 20)}
                            </p>
                          </div>
                        </td>

                        <td className="px-4">
                          <time>{date}</time>
                        </td>

                        <td className="px-4">
                          {priceFormatter.format(ticket.value / 100)}
                        </td>

                        <td className="max-w-[200px] px-2">
                          <input
                            type="text"
                            name="payment_place"
                            id="payment_place"
                            defaultValue={ticket.payment_place}
                            className="ring-none max-w-full border-b border-transparent border-b-purple-500 bg-transparent"
                            onChange={(e) =>
                              handleChangePlace(
                                e.target.value,
                                ticket as TicketProps & { userId: string }
                              )
                            }
                          />
                        </td>

                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              name="is_paid"
                              id="is_paid"
                              checked={ticket.is_paid}
                              onChange={() =>
                                handleTogglePayment(
                                  ticket as TicketProps & { userId: string }
                                )
                              }
                              className="rounded-sm text-purple-500"
                            />
                          </div>
                        </td>

                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              name="is_online"
                              id="is_online"
                              checked={ticket.is_online}
                              onChange={() =>
                                handleToggleOnline(
                                  ticket as TicketProps & { userId: string }
                                )
                              }
                              className="rounded-sm text-purple-500"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <Modal title="Editar Boleto">
                  {editModalData && <FormEditTicket ticket={editModalData} />}
                </Modal>
            </Dialog.Root>
          </table>

          <footer className="flex items-center justify-center gap-2 mt-4">
            {TOTAL_PAGES.length > 1 &&
              TOTAL_PAGES.map((_, index) => (
                <button
                  key={crypto.randomUUID()}
                  className="
                    flex items-center justify-center bg-purple-400 border h-8 w-8 rounded-md transition all 
                    hover:bg-transparent hover: border-purple-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-purple-400
                  "
                  disabled={page === index + 1}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
          </footer>
        </>
      ) : (
        <div className="flex w-full items-center justify-center rounded-md bg-zinc-700 py-10">
          <h3>
            Nenhum boleto encontrado, verifique os filtros, ou comece a
            cadastrar!
          </h3>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 flex w-full flex-1 justify-end p-4 pr-12">
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
