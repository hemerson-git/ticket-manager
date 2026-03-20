import { SignOut } from "phosphor-react";

type Props = {
  name?: string;
  email?: string;
  avatarUrl?: string;
  onSignOut?: () => void;
};

export function HeaderUser({ name, email, avatarUrl, onSignOut }: Props) {
  if (!name) return null;

  return (
    <div className="flex items-center gap-2 pl-2 border-l border-zinc-600">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`avatar de ${name}`}
          className="h-8 w-8 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-sm font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="flex flex-col text-start">
        <span className="text-sm font-semibold">{name}</span>
        {email && <span className="text-xs text-zinc-400">{email}</span>}
      </div>

      {onSignOut && (
        <button
          onClick={onSignOut}
          title="Sair"
          className="cursor-pointer text-zinc-400 transition-colors hover:text-red-400"
        >
          <SignOut size={18} />
        </button>
      )}
    </div>
  );
}
