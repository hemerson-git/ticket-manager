import { EnvelopeSimple, Globe, User } from "phosphor-react";
import { version } from "../../../package.json";

export function About() {
  return (
    <div className="flex flex-col gap-4 text-sm text-zinc-300">
      <div className="flex items-center gap-3">
        <User size={16} className="shrink-0 text-purple-400" />
        <span>Hemerson Silva</span>
      </div>

      <div className="flex items-center gap-3">
        <EnvelopeSimple size={16} className="shrink-0 text-purple-400" />
        <a
          href="mailto:hemersondev.silva@gmail.com"
          className="hover:text-purple-400 transition-colors"
        >
          hemersondev.silva@gmail.com
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Globe size={16} className="shrink-0 text-purple-400" />
        <a
          href="https://hemerson-dev.vercel.app/pt-BR"
          target="_blank"
          rel="noreferrer"
          className="hover:text-purple-400 transition-colors"
        >
          hemerson-dev.vercel.app
        </a>
      </div>

      <div className="mt-2 border-t border-zinc-700 pt-3 text-xs text-zinc-500">
        Versão {version}
      </div>
    </div>
  );
}
