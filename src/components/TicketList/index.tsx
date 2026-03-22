import { useState } from "react";
import { ArrowLineLeft, ArrowLineRight, MagnifyingGlass } from "phosphor-react";
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

function Pagination() {
  const { page, totalPages, setPage } = useTickets();
  const [search, setSearch] = useState("");

  if (!totalPages || totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  const delta = 2;
  const rangeStart = Math.max(1, page - delta);
  const rangeEnd = Math.min(totalPages, page + delta);

  if (rangeStart > 1) {
    if (rangeStart > 2) pages.push("ellipsis");
  }
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }
  if (rangeEnd < totalPages) {
    if (rangeEnd < totalPages - 1) pages.push("ellipsis");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const target = parseInt(search, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      setPage(target);
      setSearch("");
    }
  }

  return (
    <footer className="flex items-center justify-center gap-1 mt-4 flex-wrap">
      <Button
        className="h-8 w-8 justify-center !px-0 !py-0"
        variant="primary"
        disabled={page === 1}
        onClick={() => setPage(1)}
        title="Primeira página"
      >
        <ArrowLineLeft size={14} />
      </Button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-1 text-zinc-500">…</span>
        ) : (
          <Button
            key={p}
            className="h-8 w-8 justify-center !px-0 !py-0"
            variant={page === p ? "active" : "primary"}
            disabled={page === p}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        )
      )}

      <Button
        className="h-8 w-8 justify-center !px-0 !py-0"
        variant="primary"
        disabled={page === totalPages}
        onClick={() => setPage(totalPages)}
        title="Última página"
      >
        <ArrowLineRight size={14} />
      </Button>

      <form onSubmit={handleSearch} className="flex items-center gap-1 ml-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ir para..."
          className="w-20 border-0 border-b-2 border-purple-500 bg-transparent px-2 py-1 text-sm text-zinc-100 focus:outline-none"
        />
        <Button type="submit" className="h-8 w-8 justify-center !px-0 !py-0" variant="primary" title="Ir para página">
          <MagnifyingGlass size={14} />
        </Button>
      </form>
    </footer>
  );
}

export function TicketList() {
  const { tickets } = useTickets();

  const TOTAL_PRICE =
    tickets?.length > 0
      ? tickets.reduce((sum, ticket) => sum + ticket.value / 100, 0)
      : 0;

  return (
    <div className="max-h-[calc(100vh_-_140px)] overflow-auto pb-10">
      {tickets?.length ? (
        <>
          <TicketTable />
          <Pagination />
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
