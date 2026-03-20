# ticket-manager

## 1.14.2

### Patch Changes

- refactor(Filter): replace raw input elements with Input component

## 1.14.1

### Patch Changes

- refactor(Input): adopt reference project pattern — label stacked above input, border-b-2 border-purple-500 style, focus:outline-0, make id and name optional; FormEditTicket checkboxes now use Input component

## 1.14.0

### Minor Changes

- feat(TicketTable): extract table logic from TicketList into dedicated TicketTable component; TicketList is now only responsible for layout, pagination, empty state, and total price

## 1.13.0

### Minor Changes

- feat(Table): add compound Table component (wrapper, td, row, button) and apply it to TicketList replacing raw table elements with consistent styling and alternating row stripes

## 1.12.1

### Patch Changes

- fix(Button): rename `type` to `variant` to avoid collision with native HTML button `type` attribute, add `forwardRef` for Radix `asChild` compatibility, extend `ButtonHTMLAttributes` for full type safety, remove unnecessary `Slottable` wrapper
- fix(FormNewTicket, FormEditTicket): align submitted data object fields to `EditedTicket` interface (snake_case: `document_number`, `value`, `payment_place`, `is_paid`, `is_online`, `expiry_date`) to match handler expectations; convert `expiry_date` string to `Date` before submission
- fix(saveTicketHandler): destructure `userId` instead of `user_id` to match `EditedTicket` interface; convert `expiry_date` with `new Date()` before passing to Prisma, consistent with `editTicketHandler`
- refactor(DeleteTicketAlert, TicketList): replace shared inline AlertModal + AlertDialog.Root delete pattern in TicketList with per-row DeleteTicketAlert component; DeleteTicketAlert now uses `useTickets` hook and accepts `ticketId` prop instead of full ticket object1
- refactor(electron): introduce IPC channel interface files for all namespaces (ticket, user, database, configs, page); `main.cjs` and `preload.cjs` now use interface constants instead of raw strings; preload exposes typed namespaces (`TICKET`, `USER`, `DATABASE`, `CONFIGS`, `PAGE`) via `handlers.title`; fix `handlers.cjs` CJS require bug; all frontend callers updated from `window.ticket.*` / `window.config.*` style to `window.TICKET.*` / `window.CONFIGS.*` etc.
- refactor(TicketContext): add `saveTicket` function that routes to `EDIT_TICKET` when `id` is present or `SAVE_TICKET` for new records, and reloads tickets automatically; components (TicketList, FormNewTicket, FormEditTicket) now call `saveTicket` from context instead of invoking IPC directly

## 1.12.0

### Minor Changes

- Add URL-param Filter component and refactor TicketContext to useState

## 1.11.2

### Patch Changes

- Replace Google sign-in with default password screen as app entry point. Fix Prisma client regeneration and signIn race condition with upsert. Update AlertModal to match reference design with children-based action API.

## 1.11.1

### Patch Changes

- Fix: keep filter after updating the online option

## 1.11.0

### Minor Changes

- feat: add total sum of online and printed tickets

## 1.10.4

### Patch Changes

- fix: paid filter is now working again

## 1.10.3

### Patch Changes

- fix: refresh page keeps filters

## 1.10.2

### Patch Changes

- fix: duplicate ticket now keeps the filter

## 1.10.1

### Patch Changes

- fix: not scrolling on print modal

## 1.10.0

### Minor Changes

- 972345d: create range filter

### Patch Changes

- fb52479: fix filter returning empty results
- 58bd4d9: minor fixes on filter

## 1.9.0

### Minor Changes

- 965e962: create clear filter button

### Patch Changes

- 9961bea: fix: filter
- c470fc8: fix: desc order the tickets
- 53bcf37: fix: crash while selecting type all on paid filter

## 1.8.0

### Minor Changes

- add close button to change pass page

## 1.7.0

### Minor Changes

- add change password page

## 1.6.2

### Patch Changes

- fix: show page number only if it have at least 2 pages

## 1.6.1

### Patch Changes

- fix unexpected float number on save or edit ticket value

## 1.6.0

### Minor Changes

- add pagination to listTickets

## 1.5.1

### Patch Changes

- fix date and is_online filter

## 1.5.0

### Minor Changes

- df365d0: feat: add default pass create screen, divided reactToPrint into two sections
