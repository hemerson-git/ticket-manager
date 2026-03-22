export type FilterProps = {
  recipient: string;
  type: "all" | "paid" | "unpaid";
  expiry_date?: Date;
  limite_expire_date?: Date;
  document_number?: string;
  payment_place?: string;
  is_online?: boolean;
};

export const defaultFilter: FilterProps = {
  recipient: "",
  type: "all",
  document_number: "",
  payment_place: "",
  is_online: undefined,
};
