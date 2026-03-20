import { describe, it, expect } from "vitest";
import { reducers } from "./reducers";
import { actions } from "./actions";
import { globalState, FilterProps, StateProps } from ".";

const baseState: StateProps = {
  ...globalState,
  tickets: [],
  page: 1,
  totalPages: 1,
  isLoading: false,
};

const makeTicket = (id: string) => ({
  id,
  recipient: "Test User",
  document_number: "DOC-001",
  value: 100,
  payment_place: "Bank",
  is_paid: false,
  is_online: false,
  expiry_date: new Date("2024-12-01T00:00:00Z"),
  user: { name: "Admin" },
});

describe("TicketContext reducers", () => {
  describe("SET_TICKETS", () => {
    it("replaces the tickets list", () => {
      const tickets = [makeTicket("1"), makeTicket("2")];
      const result = reducers(baseState, {
        type: actions.SET_TICKETS,
        payload: tickets,
      });
      expect(result?.tickets).toEqual(tickets);
    });

    it("does not mutate other state fields", () => {
      const result = reducers(baseState, {
        type: actions.SET_TICKETS,
        payload: [makeTicket("1")],
      });
      expect(result?.page).toBe(baseState.page);
      expect(result?.totalPages).toBe(baseState.totalPages);
    });
  });

  describe("REFRESH_TICKETS", () => {
    it("replaces tickets with refreshed data", () => {
      const tickets = [makeTicket("99")];
      const result = reducers(baseState, {
        type: actions.REFRESH_TICKETS,
        payload: tickets,
      });
      expect(result?.tickets).toEqual(tickets);
    });
  });

  describe("SET_FILTER", () => {
    it("updates both tickets and filter", () => {
      const tickets = [makeTicket("5")];
      const filter: FilterProps = {
        recipient: "João",
        type: "paid",
      };

      const result = reducers(baseState, {
        type: actions.SET_FILTER,
        payload: { tickets, filters: filter },
      });

      expect(result?.tickets).toEqual(tickets);
      expect(result?.filter).toEqual(filter);
    });
  });

  describe("SET_PAGE", () => {
    it("updates the current page", () => {
      const result = reducers(baseState, {
        type: actions.SET_PAGE,
        payload: 3,
      });
      expect(result?.page).toBe(3);
    });

    it("does not affect tickets or totalPages", () => {
      const result = reducers(baseState, {
        type: actions.SET_PAGE,
        payload: 5,
      });
      expect(result?.tickets).toEqual(baseState.tickets);
      expect(result?.totalPages).toBe(baseState.totalPages);
    });
  });

  describe("SET_TOTAL_PAGE", () => {
    it("updates totalPages", () => {
      const result = reducers(baseState, {
        type: actions.SET_TOTAL_PAGE,
        payload: 10,
      });
      expect(result?.totalPages).toBe(10);
    });
  });

  describe("CLEAR_FILTER", () => {
    it("resets filter to the provided payload", () => {
      const stateWithFilter: StateProps = {
        ...baseState,
        filter: { recipient: "Someone", type: "paid" },
      };

      const result = reducers(stateWithFilter, {
        type: actions.CLEAR_FILTER,
        payload: globalState.filter,
      });

      expect(result?.filter).toEqual(globalState.filter);
    });
  });
});
