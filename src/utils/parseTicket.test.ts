import { describe, it, expect } from "vitest";
import { parseTicket } from "./parseTicket";

const makeTicket = (overrides = {}) => ({
  id: "ticket-123",
  recipient: "João Silva",
  document_number: "DOC-456",
  value: 199.99,
  payment_place: "Banco do Brasil",
  is_paid: false,
  is_online: false,
  expiry_date: new Date("2024-08-20T00:00:00Z"),
  user: { name: "Admin" },
  ...overrides,
});

describe("parseTicket", () => {
  it("maps all fields to the expected shape", () => {
    const ticket = makeTicket();
    const result = parseTicket(ticket);

    expect(result).toEqual({
      id: "ticket-123",
      recipient: "João Silva",
      ticketNumber: "DOC-456",
      ticketValue: 199.99,
      paymentPlace: "Banco do Brasil",
      isPaid: false,
      expiryDate: "2024-08-20",
    });
  });

  it("formats expiryDate as YYYY-MM-DD", () => {
    const ticket = makeTicket({ expiry_date: new Date("2024-01-05T00:00:00Z") });
    const { expiryDate } = parseTicket(ticket);
    expect(expiryDate).toBe("2024-01-05");
  });

  it("reflects is_paid = true", () => {
    const ticket = makeTicket({ is_paid: true });
    expect(parseTicket(ticket).isPaid).toBe(true);
  });

  it("reflects the correct ticket value", () => {
    const ticket = makeTicket({ value: 0 });
    expect(parseTicket(ticket).ticketValue).toBe(0);
  });

  it("does not include is_online in the output", () => {
    const ticket = makeTicket();
    const result = parseTicket(ticket) as Record<string, unknown>;
    expect(result).not.toHaveProperty("is_online");
  });

  it("does not include user in the output", () => {
    const ticket = makeTicket();
    const result = parseTicket(ticket) as Record<string, unknown>;
    expect(result).not.toHaveProperty("user");
  });
});
