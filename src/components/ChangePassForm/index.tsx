import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "phosphor-react";
import { Button } from "../Button";
import { Input } from "../Input";

const passSchema = z
  .object({
    currentPass: z.string(),
    newPass: z
      .string({ required_error: "Preencha a senha" })
      .trim()
      .min(4, "A senha deve ter pelo menos 4 caracteres"),
    confirmNewPass: z.string().trim().min(4),
  })
  .refine((data) => data.newPass === data.confirmNewPass, {
    message: "As senhas devem ser iguais",
    path: ["confirmDefaultPass"],
  });

type Props = {
  onSaved?: () => void;
  onError?: (message: string) => void;
};

export function ChangePassForm({ onSaved, onError }: Props) {
  const [isPassVisible, setIsPassVisible] = useState(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passSchema) });

  async function onSubmit(formValues: FieldValues) {
    const { currentPass, newPass } = passSchema.parse(formValues);

    const isValid = await window.CONFIGS.COMPARE_PASS(currentPass);
    if (!isValid) {
      setError("currentPass", { message: "Senha incorreta" });
      return;
    }

    try {
      const hasSuccess = await window.CONFIGS.CHANGE_PASS({ newPass, pass: currentPass });
      if (hasSuccess) onSaved?.();
    } catch {
      onError?.("Erro ao alterar a senha!");
    }
  }

  const toggleVisibility = () => setIsPassVisible((v) => !v);
  const eyeButton = (
    <button
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 text-zinc-400 hover:text-zinc-100"
      onClick={toggleVisibility}
      type="button"
    >
      {isPassVisible ? <EyeClosed size={14} /> : <Eye size={14} />}
    </button>
  );

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <Controller
          name="currentPass"
          control={control}
          render={({ field }) => (
            <Input
              id="currentPass"
              label="Senha atual"
              type={isPassVisible ? "text" : "password"}
              error={errors?.currentPass?.message as string}
              {...field}
            />
          )}
        />
        {eyeButton}
      </div>

      <div className="relative">
        <Controller
          name="newPass"
          control={control}
          render={({ field }) => (
            <Input
              id="newPass"
              label="Nova senha"
              type={isPassVisible ? "text" : "password"}
              error={errors?.newPass?.message as string}
              {...field}
            />
          )}
        />
        {eyeButton}
      </div>

      <div className="relative">
        <Controller
          name="confirmNewPass"
          control={control}
          render={({ field }) => (
            <Input
              id="confirmNewPass"
              label="Confirmar nova senha"
              type={isPassVisible ? "text" : "password"}
              error={errors?.confirmDefaultPass?.message as string}
              {...field}
            />
          )}
        />
        {eyeButton}
      </div>

      <footer className="flex justify-end gap-2 mt-2">
        <Button type="submit">Confirmar</Button>
      </footer>
    </form>
  );
}
