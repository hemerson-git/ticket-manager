import type { TicketProps } from "../../components/TicketList";
import type { FilterProps } from "./actions";

type TicketPage = { tickets: TicketProps[]; pages: number };

export async function fetchTickets(page: number, size = 100): Promise<TicketPage> {
  return (window as any).ticket.listTicket({ page, size });
}

export async function fetchFilteredTickets(
  filter: FilterProps,
  page = 1,
  size = 100
): Promise<TicketPage> {
  const { type, ...rest } = filter;

  const activeParams: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== "") {
      activeParams[key] = value;
    }
  }

  if (type === "all" && !Object.keys(activeParams).length) {
    return (window as any).ticket.listTicket({ page, size });
  }

  return (window as any).ticket.filterTicket({
    page,
    size,
    ...(type !== "all" && { is_paid: type === "paid" }),
    ...activeParams,
  });
}
