import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { TicketProps } from "../../components/TicketList";
import { FilterProps, defaultFilter } from "./actions";
import { fetchFilteredTickets } from "./actions-builder";

export type { FilterProps };
export { defaultFilter };

type TicketContextProps = {
  tickets: TicketProps[];
  filter: FilterProps;
  page: number;
  totalPages: number;
  isLoading: boolean;
  loadTickets: () => Promise<void>;
  setFilter: (filter: FilterProps, page?: number) => void;
  clearFilter: () => void;
  setPage: (page: number) => void;
};

export const TicketContext = createContext({} as TicketContextProps);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<TicketProps[]>([]);
  const [filter, setFilterState] = useState<FilterProps>(defaultFilter);
  const [page, setPageState] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const { tickets: data, pages } = await fetchFilteredTickets(filter, page);
      setTickets(data);
      setTotalPages(pages);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  function setFilter(newFilter: FilterProps, newPage = 1) {
    setFilterState(newFilter);
    setPageState(newPage);
  }

  function clearFilter() {
    setFilterState(defaultFilter);
    setPageState(1);
  }

  return (
    <TicketContext.Provider
      value={{
        tickets,
        filter,
        page,
        totalPages,
        isLoading,
        loadTickets,
        setFilter,
        clearFilter,
        setPage: setPageState,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export const useTicket = () => useContext(TicketContext);
