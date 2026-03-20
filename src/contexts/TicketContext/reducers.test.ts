import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTickets, fetchFilteredTickets } from "./actions-builder";
import { defaultFilter, type FilterProps } from "./actions";

const mockListTicket = vi.fn();
const mockFilterTicket = vi.fn();

vi.stubGlobal("window", {
  ticket: {
    listTicket: mockListTicket,
    filterTicket: mockFilterTicket,
  },
});

const mockResponse = { tickets: [], pages: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  mockListTicket.mockResolvedValue(mockResponse);
  mockFilterTicket.mockResolvedValue(mockResponse);
});

describe("fetchTickets", () => {
  it("calls listTicket with page and size", async () => {
    await fetchTickets(2, 50);
    expect(mockListTicket).toHaveBeenCalledWith({ page: 2, size: 50 });
  });

  it("defaults size to 100", async () => {
    await fetchTickets(1);
    expect(mockListTicket).toHaveBeenCalledWith({ page: 1, size: 100 });
  });

  it("returns the response from listTicket", async () => {
    const response = { tickets: [{ id: "1" }], pages: 3 };
    mockListTicket.mockResolvedValue(response);
    const result = await fetchTickets(1);
    expect(result).toEqual(response);
  });
});

describe("fetchFilteredTickets", () => {
  it("uses listTicket when filter is empty and type is 'all'", async () => {
    await fetchFilteredTickets(defaultFilter);
    expect(mockListTicket).toHaveBeenCalled();
    expect(mockFilterTicket).not.toHaveBeenCalled();
  });

  it("uses filterTicket when recipient is set", async () => {
    const filter: FilterProps = { ...defaultFilter, recipient: "João" };
    await fetchFilteredTickets(filter);
    expect(mockFilterTicket).toHaveBeenCalledWith(
      expect.objectContaining({ recipient: "João" })
    );
  });

  it("sets is_paid=true for type 'paid'", async () => {
    const filter: FilterProps = { ...defaultFilter, type: "paid" };
    await fetchFilteredTickets(filter);
    expect(mockFilterTicket).toHaveBeenCalledWith(
      expect.objectContaining({ is_paid: true })
    );
  });

  it("sets is_paid=false for type 'unpaid'", async () => {
    const filter: FilterProps = { ...defaultFilter, type: "unpaid" };
    await fetchFilteredTickets(filter);
    expect(mockFilterTicket).toHaveBeenCalledWith(
      expect.objectContaining({ is_paid: false })
    );
  });

  it("omits is_paid when type is 'all' but other filters are active", async () => {
    const filter: FilterProps = { ...defaultFilter, recipient: "Test" };
    await fetchFilteredTickets(filter);
    const call = mockFilterTicket.mock.calls[0][0];
    expect(call).not.toHaveProperty("is_paid");
  });

  it("excludes undefined and empty string values", async () => {
    const filter: FilterProps = {
      ...defaultFilter,
      document_number: "",
      is_online: undefined,
    };
    await fetchFilteredTickets(filter);
    expect(mockListTicket).toHaveBeenCalled();
    expect(mockFilterTicket).not.toHaveBeenCalled();
  });

  it("passes page and size to filterTicket", async () => {
    const filter: FilterProps = { ...defaultFilter, recipient: "Test" };
    await fetchFilteredTickets(filter, 3, 50);
    expect(mockFilterTicket).toHaveBeenCalledWith(
      expect.objectContaining({ page: 3, size: 50 })
    );
  });
});
