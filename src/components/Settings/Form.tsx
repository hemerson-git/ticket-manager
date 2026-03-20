import { useEffect, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { useTickets } from "../../hooks/TicketContext";

type Props = {
  onSaved?: () => void;
};

export function Form({ onSaved }: Props) {
  const { setItemsPerPage } = useTickets();
  const [itemsPerPage, setLocalItemsPerPage] = useState<number>(20);

  useEffect(() => {
    window.CONFIGS.GET_ITEMS_PER_PAGE().then(setLocalItemsPerPage);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await window.CONFIGS.SET_ITEMS_PER_PAGE(itemsPerPage);
    setItemsPerPage(itemsPerPage);
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="items_per_page"
        label="Items per page"
        type="number"
        min={1}
        value={itemsPerPage}
        onChange={(e) => setLocalItemsPerPage(Number(e.target.value))}
      />

      <footer className="flex items-center justify-center mt-6">
        <Button type="submit">Save</Button>
      </footer>
    </form>
  );
}
