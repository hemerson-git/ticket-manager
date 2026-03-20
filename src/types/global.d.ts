import type { DBTicket, EditedTicket } from "./ticket";

export {};

declare global {
  interface Window {
    TICKET: {
      SAVE_TICKET: (data: TicketProps) => Promise<TicketProps>;
      LIST_TICKET: (data?: { page?: number; size?: number }) => Promise<{ tickets: DBTicket[]; pages: number }>;
      EDIT_TICKET: (data: Partial<EditedTicket>) => Promise<DBTicket>;
      DELETE_TICKET: ({id: string}) => Promise<boolean>;
      FILTER_TICKET: (data: unknown) => Promise<{ tickets: DBTicket[]; pages: number }>;
      GET_TOTAL_TICKETS: () => Promise<number>;
    };

    USER: {
      SIGN_IN: () => Promise<{ id: string; name: string; email: string; avatarUrl: string }>;
      IS_FIRST_USER: () => Promise<boolean>;
    };

    DATABASE: {
      EXPORT_DATABASE: () => Promise<void>;
      IMPORT_DATABASE: () => Promise<boolean>;
    };

    CONFIGS: {
      SET_DEFAULT_PASS: (pass: string) => Promise<boolean>;
      COMPARE_PASS: (pass: string) => Promise<boolean>;
      HAS_DEFAULT_PASS: () => Promise<boolean>;
      CHANGE_PASS: (data: { pass: string; newPass: string }) => Promise<boolean>;
    };

    PAGE: {
      RELOAD_WINDOW: () => Promise<void>;
    };
  }
}
