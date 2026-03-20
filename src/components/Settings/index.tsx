import { Link } from "react-router-dom";
import { Form } from "./Form";

type Props = {
  onSaved?: () => void;
};

export function Settings({ onSaved }: Props) {
  return (
    <div>
      <Link to="/change-pass">Change Password</Link>

      <Form onSaved={onSaved} />
    </div>
  );
}
