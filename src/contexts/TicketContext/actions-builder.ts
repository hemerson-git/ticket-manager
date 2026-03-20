import type { TicketProps } from "../../components/TicketList";
import type { FilterProps } from "./actions";

type TicketPage = { tickets: TicketProps[]; pages: number };

export async function fetchTickets(page: number, size: number): Promise<TicketPage> {
  return window.TICKET.LIST_TICKET({ page, size });
}

export async function fetchFilteredTickets(
  filter: FilterProps,
  page = 1,
  size = 20
): Promise<TicketPage> {
  const { type, ...rest } = filter;

  const activeParams: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== "") {
      activeParams[key] = value;
    }
  }

  if (type === "all" && !Object.keys(activeParams).length) {
    return window.TICKET.LIST_TICKET({ page, size });
  }

  return window.TICKET.FILTER_TICKET({
    page,
    size,
    ...(type !== "all" && { is_paid: type === "paid" }),
    ...activeParams,
  });
}
