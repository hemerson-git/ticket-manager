import { Form } from "./Form";

type Props = {
  onSaved?: () => void;
};

export function Settings({ onSaved }: Props) {
  return <Form onSaved={onSaved} />;
}
