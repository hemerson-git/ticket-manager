# ticket-manager

## 1.15.18

### Patch Changes

- fix(pagination): show windowed page buttons with first/last/search controls; fix icon visibility with !px-0 !py-0 override; add disabled styles to Button

## 1.15.17

### Patch Changes

- fix(ChangePassForm): vertically center eye toggle button relative to input field

## 1.15.16

### Patch Changes

- fix(Input): center checkboxes horizontally in table cells

## 1.15.15

### Patch Changes

- fix(auth): call signIn before navigating to home so user component renders immediately; fix signOut to redirect to DefaultPass screen

## 1.15.14

### Patch Changes

- fix(ReactToPrint): restore min-w-[50vw] on print dialog

## 1.15.13

### Patch Changes

- fix(Modal): replace min-w-[50vw] with min-w-[200px] to allow narrower dialogs; set config dialogs to w-[300px]

## 1.15.12

### Patch Changes

- feat(About): add About dialog to settings dropdown menu with author info and app version

## 1.15.11

### Patch Changes

- fix(Input): display error message below input instead of overlapping border

  Also replace change password page navigation with a dialog opened from the settings dropdown menu.

## 1.15.10

### Patch Changes

- fix(Home): defer settings dialog open to resolve focus trap after DropdownMenu closes

  Replace settings gear button with DropdownMenu containing "Configurações" and "Alterar Senha" items. Use setTimeout deferral when opening the settings Dialog from DropdownMenu.Item so Radix DismissableLayer fully cleans up before the dialog mounts, preventing focus trap that blocked all UI interaction.

## 1.15.9

### Patch Changes

- fix(Filter): add bg-zinc-800 rounded background to filter bar container

  fix(ReactToPrint): change trigger Button variant from ghost to primary for better visibility

## 1.15.8

### Patch Changes

- fix(Modal): increase padding from p-4 pb-2 to p-6 so content doesn't sit tight against borders; feat(Home): require password before export/import database — show password dialog, verify via COMPARE_PASS before calling IPC; fix(vite): restore HMR by scoping base:./ to production builds only and enable usePolling for WSL2 compatibility

## 1.15.7

### Patch Changes

- fix(electron): resolve file paths correctly in packaged app — set DATABASE_URL to absolute path before PrismaClient initializes using process.resourcesPath; fix database export/import to use process.resourcesPath when packaged; move configs.json to app.getPath('userData') for guaranteed write access; pass BrowserWindow to dialogs so they display correctly; use VACUUM INTO for export to avoid SQLite file lock; disconnect Prisma before import

## 1.15.6

### Patch Changes

- fix(TicketList): highlight active pagination page with filled purple — add active variant to Button (bg-purple-500 text-white) and use it for the current page instead of the danger/red variant

## 1.15.5

### Patch Changes

- fix(TicketList): highlight active pagination page with filled purple — add active variant to Button (bg-purple-500 text-white) and use it for the current page instead of the danger/red variant; also show toast when edited ticket is saved

## 1.15.4

### Patch Changes

- fix(FormEditTicket): use Controller for checkboxes to fix value not saving — register() without forwardRef can't sync checked state via ref; Controller with explicit checked/onChange binding ensures is_paid and is_online are properly submitted; also replace raw submit button with Button component
- fix(Input): align checkbox and label horizontally — checkboxes now use flex-row items-center so the label sits beside the input instead of stacking above it

## 1.15.3

### Patch Changes

- fix(Toast): dark background with blur and low opacity (bg-zinc-900/60 backdrop-blur-sm) to match app visual style

## 1.15.2

### Patch Changes

- refactor(buttons): replace all raw button elements with Button component across Filter, FormNewTicket, ReactToPrint, TicketList pagination, and SignIn; add ghost variant for borderless utility actions

## 1.15.1

### Patch Changes

- fix(Modal, ReactToPrint): constrain modal to max-h-[90vh] with flex-col so header and footer are always visible; print content area scrolls independently with flex-1 overflow-y-auto

## 1.15.0

### Minor Changes

- feat(Filter): add payment_place filter field to the filter bar

  feat(Settings): wire items-per-page IPC round-trip — getItemsPerPage/setItemsPerPage handlers read/write configs.json; TicketContext loads the value on mount and passes it as page size so the list respects the setting; saving reloads the ticket list and shows a toast confirmation

### Patch Changes

- fix(Input): show only bottom border (border-b-2) instead of full border; checkboxes show full border with purple fill when checked

  fix(Filter): style selects to match Input underline pattern; filter inputs fill available width equally

  fix(TicketTable): edit dialog not opening on pencil click — onOpenChange now only clears data when dialog closes, not on open

  fix(Modal, AlertDialog): add dark background with opacity and blur (bg-black/60 backdrop-blur-sm) to overlays

  fix(Home): settings modal max width reduced; render toast outside modal to fix viewport stacking context positioning; wrap HomeHeader return in fragment for adjacent JSX

## 1.14.3

### Patch Changes

- refactor(TicketTable): replace raw input elements with Input component

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
