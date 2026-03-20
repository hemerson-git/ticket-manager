import { useEffect, useRef, useState } from "react";
import { Pencil, Trash, CopySimple, Repeat } from "phosphor-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Table } from "../Table";
import { Input } from "../Input";
import { Modal } from "../Modal";
import { Toast } from "../Toast";
import { FormEditTicket } from "../FormEditTicket";
import { DeleteTicketAlert } from "../DeleteTicketAlert";
import { useTickets } from "../../hooks/TicketContext";
import { useUserContext } from "../../hooks/UserContext";
import { defaultFilter } from "../../contexts/TicketContext";
import type { TicketProps } from "../TicketList";
import { headers } from "./constants";

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

export function TicketTable() {
  const { tickets, filter, page, setFilter, saveTicket } = useTickets();
  const { state: userState } = useUserContext();

  const [editModalData, setEditModalData] = useState<TicketProps | null>(null);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleTogglePayment(ticket: TicketProps & { userId: string }) {
    await saveTicket({
      id: ticket.id,
      recipient: ticket.recipient,
      document_number: ticket.document_number,
      value: ticket.value,
      payment_place: ticket.payment_place,
      is_paid: !ticket.is_paid,
      is_online: ticket.is_online,
      expiry_date: ticket.expiry_date,
      userId: ticket.userId,
    });

    if (JSON.stringify(filter) !== JSON.stringify(defaultFilter)) {
      setFilter(filter);
    }
  }

  async function handleToggleOnline(ticket: TicketProps & { userId: string }) {
    await saveTicket({
      id: ticket.id,
      recipient: ticket.recipient,
      document_number: ticket.document_number,
      value: ticket.value,
      payment_place: ticket.payment_place,
      is_paid: ticket.is_paid,
      is_online: !ticket.is_online,
      expiry_date: ticket.expiry_date,
      userId: ticket.userId,
    });

    setFilter(filter, page);
  }

  async function handleChangePlace(
    place: string,
    ticket: TicketProps & { userId: string }
  ) {
    try {
      await saveTicket({
        id: ticket.id,
        recipient: ticket.recipient,
        document_number: ticket.document_number,
        value: ticket.value,
        payment_place: place,
        is_paid: ticket.is_paid,
        is_online: ticket.is_online,
        expiry_date: ticket.expiry_date,
        userId: ticket.userId,
      });
    } catch {
      alert("Não foi possível salvar as alterações, tente novamente");
    }
  }

  async function handleDuplicateTicket(ticket: TicketProps) {
    await saveTicket({
      recipient: ticket.recipient,
      document_number: ticket.document_number,
      value: ticket.value,
      payment_place: ticket.payment_place,
      is_paid: ticket.is_paid,
      is_online: ticket.is_online,
      expiry_date: ticket.expiry_date,
      userId: userState.user.id,
    });
  }

  return (
    <>
      <Table.wrapper>
        <thead>
          <tr>
            {headers.map((header) => (
              <Table.td key={header} className="font-bold">
                {header}
              </Table.td>
            ))}
          </tr>
        </thead>

        <Dialog.Root
          open={Boolean(editModalData)}
          onOpenChange={(open) => { if (!open) setEditModalData(null); }}
        >
          <tbody>
            {tickets.map((ticket, index) => {
              const date = dateFormat.format(new Date(ticket.expiry_date));

              return (
                <Table.row key={ticket.id} isOdd={index}>
                  <Table.td>
                    <Dialog.Trigger asChild onClick={() => setEditModalData(ticket)}>
                      <Table.button>
                        <Pencil size={14} />
                      </Table.button>
                    </Dialog.Trigger>
                  </Table.td>

                  <Table.td>
                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
                        <Table.button>
                          <Trash size={14} />
                        </Table.button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Portal>
                        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] rounded-lg bg-zinc-800 p-6 shadow-xl">
                          <AlertDialog.Title className="mb-2 text-lg font-bold">
                            Deletar boleto?
                          </AlertDialog.Title>
                          <DeleteTicketAlert ticketId={ticket.id} />
                        </AlertDialog.Content>
                      </AlertDialog.Portal>
                    </AlertDialog.Root>
                  </Table.td>

                  <Table.td>
                    <Table.button onClick={() => handleDuplicateTicket(ticket)}>
                      <Repeat size={14} />
                    </Table.button>
                  </Table.td>

                  <Table.td className="text-left">{ticket.recipient}</Table.td>

                  <Table.td>
                    <div className="flex w-[120px] items-center gap-2 overflow-hidden">
                      <Table.button
                        type="button"
                        title="Copiar para o Clipboard"
                        onClick={() => {
                          navigator.clipboard.writeText(ticket.document_number);
                          if (timerRef.current) clearTimeout(timerRef.current);
                          timerRef.current = setTimeout(() => setIsToastOpen(true), 2000);
                        }}
                      >
                        <CopySimple size={14} />
                      </Table.button>
                      <p className="line-clamp-1">
                        {ticket.document_number.slice(0, 20)}
                      </p>
                    </div>
                  </Table.td>

                  <Table.td>
                    <time>{date}</time>
                  </Table.td>

                  <Table.td>{priceFormatter.format(ticket.value / 100)}</Table.td>

                  <Table.td className="max-w-[200px]">
                    <Input
                      type="text"
                      name="payment_place"
                      defaultValue={ticket.payment_place}
                      className="max-w-full text-sm"
                      onChange={(e) =>
                        handleChangePlace(
                          e.target.value,
                          ticket as TicketProps & { userId: string }
                        )
                      }
                    />
                  </Table.td>

                  <Table.td>
                    <Input
                      type="checkbox"
                      checked={ticket.is_paid}
                      onChange={() =>
                        handleTogglePayment(ticket as TicketProps & { userId: string })
                      }
                    />
                  </Table.td>

                  <Table.td>
                    <Input
                      type="checkbox"
                      checked={ticket.is_online}
                      onChange={() =>
                        handleToggleOnline(ticket as TicketProps & { userId: string })
                      }
                    />
                  </Table.td>
                </Table.row>
              );
            })}
          </tbody>

          <Modal title="Editar Boleto">
            {editModalData && <FormEditTicket ticket={editModalData} />}
          </Modal>
        </Dialog.Root>
      </Table.wrapper>

      <Toast
        title="Copiado!"
        description="Texto Copiado para a área de transferência"
        isOpen={isToastOpen}
        onOpenChange={setIsToastOpen}
      />
    </>
  );
}
