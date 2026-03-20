import { useSearchParams } from "react-router-dom";
import { useTickets } from "../../hooks/TicketContext";
import type { FilterProps } from "../../contexts/TicketContext";
import { Input } from "../Input";

function parseParams(params: URLSearchParams): FilterProps {
  const isOnlineParam = params.get("is_online");
  const expiryDateParam = params.get("expiry_date");
  const limiteExpireDateParam = params.get("limite_expire_date");

  return {
    recipient: params.get("recipient") || "",
    document_number: params.get("document_number") || "",
    type: (params.get("type") as FilterProps["type"]) || "all",
    is_online:
      isOnlineParam === null
        ? undefined
        : isOnlineParam === "on-line",
    expiry_date: expiryDateParam ? new Date(expiryDateParam) : undefined,
    limite_expire_date: limiteExpireDateParam
      ? new Date(limiteExpireDateParam)
      : undefined,
  };
}

export function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setFilter, clearFilter } = useTickets();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value) {
        next.set(name, value);
      } else {
        next.delete(name);
      }

      if (name === "expiry_date" && !value) {
        next.delete("limite_expire_date");
      }

      setFilter(parseParams(next));
      return next;
    });
  }

  function handleClear() {
    setSearchParams(new URLSearchParams());
    clearFilter();
  }

  const hasExpiry = !!searchParams.get("expiry_date");

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          name="recipient"
          placeholder="Beneficiário"
          value={searchParams.get("recipient") || ""}
          onChange={handleChange}
          className="max-w-[145px] text-sm"
        />

        <Input
          type="number"
          name="document_number"
          placeholder="Nº do documento"
          value={searchParams.get("document_number") || ""}
          onChange={handleChange}
          className="max-w-[145px] text-sm"
        />

        <Input
          type="date"
          name="expiry_date"
          value={searchParams.get("expiry_date") || ""}
          onChange={handleChange}
          className="text-sm"
        />

        <Input
          type="date"
          name="limite_expire_date"
          value={hasExpiry ? searchParams.get("limite_expire_date") || "" : ""}
          onChange={handleChange}
          disabled={!hasExpiry}
          className="text-sm disabled:cursor-not-allowed disabled:opacity-30"
        />

        <select
          name="is_online"
          value={searchParams.get("is_online") || ""}
          onChange={handleChange}
          className="rounded-sm border-b border-purple-500 bg-transparent px-2 py-1 text-sm outline-none"
        >
          <option value="">Todos</option>
          <option value="on-line">On-line</option>
          <option value="printed">Impresso</option>
        </select>

        <select
          name="type"
          value={searchParams.get("type") || "all"}
          onChange={handleChange}
          className="rounded-sm border-b border-purple-500 bg-transparent px-2 py-1 text-sm outline-none"
        >
          <option value="all">Todos</option>
          <option value="paid">Pagos</option>
          <option value="unpaid">Não pagos</option>
        </select>
      </div>

      <button
        onClick={handleClear}
        className="text-sm text-zinc-400 hover:text-white transition-colors"
      >
        Limpar
      </button>
    </div>
  );
}
