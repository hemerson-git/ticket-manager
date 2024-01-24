import { ReactNode, useRef, useState } from "react";
import { TicketProps } from "../TicketList";
import { useReactToPrint } from "react-to-print";
import { Printer } from "phosphor-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Modal } from "../Modal";

type Props = {
  tickets: TicketProps[];
};

type ButtonProps = {
  children: ReactNode;
};

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ReactToPrint({ tickets }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "Boletos",
    onAfterPrint: () => setIsOpen(false),
  });

  const PRINTABLE_TICKETS = tickets?.length
    ? tickets.filter((ticket) => !ticket.is_online)
    : [];

  const ONLINE_TICKETS = tickets?.length
    ? tickets.filter((ticket) => ticket.is_online)
    : [];

  return (
    <div>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Modal title="Imprimir Boleto" className="overflow-y-auto">
          <>
            <div
              className={`flex min-h-[calc(100vh_-_200px)] w-full flex-col items-center p-4 scroll-auto`}
              ref={contentRef}
            >
              <table className="w-[85%] border border-zinc-900" border={1}>
                <thead>
                  <tr className="mb-1 border-b border-zinc-900 pb-1">
                    <td className="border border-zinc-900 font-bold">
                      Beneficiário
                    </td>

                    <td className="border border-zinc-900 font-bold">Valor</td>
                  </tr>
                </thead>

                <tbody>
                  {PRINTABLE_TICKETS.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="border border-zinc-900">
                        {ticket.recipient}
                      </td>

                      <td className="border border-zinc-900">
                        {priceFormatter.format(ticket.value / 100)}
                      </td>
                    </tr>
                  ))}

                  <tr className="border border-zinc-900 font-bold">
                    <td>.</td>
                  </tr>

                  <tr className="border border-zinc-900">
                    <td className="border border-zinc-900 font-bold">Total</td>
                    <td colSpan={2}>
                      {priceFormatter.format(
                        PRINTABLE_TICKETS.reduce(
                          (buffer, ticket) => buffer + ticket.value,
                          0
                        ) / 100
                      )}
                    </td>
                  </tr>

                  <tr className="border border-zinc-900 font-bold">
                    <td className="border border-zinc-900">'</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <h3 className="w-[85%] mt-4 mb-2 font-bold">Boletos On-line</h3>
              <table className="w-[85%] border border-zinc-900" border={1}>
                <thead>
                  <tr className="mb-1 border-b border-zinc-900 pb-1">
                    <td className="border border-zinc-900 font-bold">
                      Beneficiário
                    </td>

                    <td className="border border-zinc-900 font-bold">Valor</td>
                  </tr>
                </thead>

                <tbody>
                  {ONLINE_TICKETS.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="border border-zinc-900">
                        {ticket.recipient}
                      </td>

                      <td className="border border-zinc-900">
                        {priceFormatter.format(ticket.value / 100)}
                      </td>
                    </tr>
                  ))}

                  <tr className="border border-zinc-900 font-bold">
                    <td>.</td>
                  </tr>

                  <tr className="border border-zinc-900">
                    <td className="border border-zinc-900 font-bold">Total</td>
                    <td colSpan={2}>
                      {priceFormatter.format(
                        ONLINE_TICKETS.reduce(
                          (buffer, ticket) => buffer + ticket.value,
                          0
                        ) / 100
                      )}
                    </td>
                  </tr>

                  <tr className="border border-zinc-900 font-bold">
                    <td className="border border-zinc-900">'</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <h3 className="w-[85%] mt-4 mb-2 font-bold">Soma</h3>
              <table className="w-[85%] border border-zinc-900" border={1}>
                <thead>
                  <tr className="mb-1 border-b border-zinc-900 pb-1">
                    <td className="border border-zinc-900 font-bold">
                      Beneficiário
                    </td>

                    <td className="border border-zinc-900 font-bold">Valor</td>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border border-zinc-900">
                    <td className="border border-zinc-900 font-bold">Total</td>
                    <td colSpan={2}>
                      {priceFormatter.format(
                        tickets.reduce(
                          (buffer, ticket) => buffer + ticket.value,
                          0
                        ) / 100
                      )}
                    </td>
                  </tr>

                  <tr className="border border-zinc-900 font-bold">
                    <td className="border border-zinc-900">'</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <footer className="flex items-center justify-end px-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-sm border border-purple-400 px-4 py-1 text-purple-500 
                  transition-colors hover:bg-purple-500 hover:text-white"
              >
                Imprimir
              </button>
            </footer>
          </>
        </Modal>

        <Dialog.Trigger className="flex items-center gap-2">
          Imprimir <Printer />
        </Dialog.Trigger>
      </Dialog.Root>
    </div>
  );
}

export function PrinterButton({ children }: ButtonProps) {
  return <button onClick={print}>{children}</button>;
}
