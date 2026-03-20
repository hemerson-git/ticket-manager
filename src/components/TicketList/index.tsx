import { useTickets } from "../../hooks/TicketContext";
import { TicketTable } from "../TicketTable";
import { Button } from "../Button";

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

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TicketList() {
  const { tickets, page, totalPages, setPage } = useTickets();

  const TOTAL_PAGES = Array(totalPages ?? 1).fill("");
  const TOTAL_PRICE =
    tickets?.length > 0
      ? tickets.reduce((sum, ticket) => sum + ticket.value / 100, 0)
      : 0;

  return (
    <div className="max-h-[calc(100vh_-_140px)] overflow-auto pb-10">
      {tickets?.length ? (
        <>
          <TicketTable />

          <footer className="flex items-center justify-center gap-2 mt-4">
            {TOTAL_PAGES.length > 1 &&
              TOTAL_PAGES.map((_, index) => (
                <Button
                  key={index}
                  className="h-8 w-8 justify-center px-0 py-0"
                  variant={page === index + 1 ? "danger" : "primary"}
                  disabled={page === index + 1}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </Button>
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
    </div>
  );
}
