export interface DBTicket {
  id: string;
  recipient: string;
  document_number: string;
  expiry_date: Date;
  value: number;
  payment_place: string;
  is_paid: boolean;
  is_online: boolean;
  user: {
    name: string;
  };
  updated_at: Date;
  created_at: Date;
  userId: string;
}

export interface Ticket {
  id: string;
  recipient: string;
  document_number: string;
  expiry_date: string;
  value: string;
  payment_place: string;
  is_paid: boolean;
  is_online: boolean;
  author: string;
}

export interface EditedTicket {
  id?: string;
  recipient: string;
  userId?: string;
  document_number: string;
  expiry_date: Date;
  value: number;
  payment_place: string;
  is_paid: boolean;
  is_online: boolean;
}
