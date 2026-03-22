import { Input } from "../Input";
import { Button } from "../Button";
import { TicketProps } from "../TicketList";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { useUserContext } from "../../hooks/UserContext";
import { useTickets } from "../../hooks/TicketContext";

type Props = {
  ticket: TicketProps;
  onSaved?: () => void;
};

type FormData = {
  recipient: string;
  ticket_number: string;
  ticket_value: string;
  payment_place: string;
  is_paid: boolean;
  expiry_date: string;
  is_online: boolean;
};

const schema = z.object({
  recipient: z
    .string()
    .nonempty({ message: "Esse campo não pode ficar vazio" }),
  ticket_number: z.string(),
  ticket_value: z.string(),
  payment_place: z.string(),
  is_paid: z.boolean(),
  expiry_date: z.string(),
  is_online: z.boolean(),
});

export function FormEditTicket({ ticket, onSaved }: Props) {
  const { state } = useUserContext();
  const { saveTicket } = useTickets();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      recipient: ticket.recipient,
      ticket_value: String(ticket.value / 100),
      payment_place: ticket.payment_place,
      expiry_date: ticket.expiry_date.toISOString().slice(0, 10),
      is_paid: ticket.is_paid,
      is_online: ticket.is_online,
      ticket_number: ticket.document_number,
    },
  });

  async function onSubmit(formValues: FormData) {
    const data = {
      id: ticket.id,
      recipient: formValues.recipient,
      document_number: formValues.ticket_number,
      value: Math.round(Number(formValues.ticket_value) * 100),
      payment_place: formValues.payment_place,
      is_paid: formValues.is_paid,
      is_online: formValues.is_online,
      expiry_date: new Date(formValues.expiry_date),
      userId: state.user.id,
    };

    await saveTicket(data);
    onSaved?.();
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="flex flex-col"
    >
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        <Controller
          name="recipient"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              id="recipient"
              placeholder="Beneficiário"
              error={errors?.recipient?.message ?? ""}
              {...field}
            />
          )}
        />

        <Controller
          name="expiry_date"
          control={control}
          render={({ field }) => (
            <Input type="date" id="expiry_date" {...field} />
          )}
        />

        <Controller
          name="ticket_number"
          control={control}
          render={({ field }) => (
            <Input type="text" id="ticket_number" {...field} />
          )}
        />

        <Controller
          name="ticket_value"
          control={control}
          render={({ field }) => (
            <Input type="number" id="ticket_value" {...field} />
          )}
        />

        <Controller
          name="payment_place"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Local do pagamento"
              id="payment_place"
              {...field}
            />
          )}
        />

        <div className="flex items-center justify-start gap-4">
          <Controller
            name="is_paid"
            control={control}
            render={({ field }) => (
              <Input
                type="checkbox"
                id="is_paid"
                label="Pago"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />

          <Controller
            name="is_online"
            control={control}
            render={({ field }) => (
              <Input
                type="checkbox"
                id="is_online"
                label="Online"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>
      </div>

      <footer className="mt-10 flex items-center justify-center">
        <Button type="submit">Salvar Boleto</Button>
      </footer>
    </form>
  );
}
