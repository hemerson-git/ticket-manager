import { useEffect, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";

export function Form() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  useEffect(() => {
    window.CONFIGS.GET_ITEMS_PER_PAGE().then(setItemsPerPage);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await window.CONFIGS.SET_ITEMS_PER_PAGE(itemsPerPage);
    await window.PAGE.RELOAD_WINDOW();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="items_per_page"
        label="Items per page"
        type="number"
        min={1}
        value={itemsPerPage}
        onChange={(e) => setItemsPerPage(Number(e.target.value))}
      />

      <footer className="flex items-center justify-center mt-6">
        <Button type="submit">Save</Button>
      </footer>
    </form>
  );
}
