import { HeaderTitle } from "./Title";

type Props = {
  title: string;
  children?: React.ReactNode;
};

export function HeaderWrapper({ title, children }: Props) {
  return (
    <header className="flex w-full items-center gap-4 bg-zinc-800 px-4 py-3">
      <HeaderTitle title={title} />
      {children}
    </header>
  );
}
