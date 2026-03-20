type Props = {
  title: string;
};

export function HeaderTitle({ title }: Props) {
  return (
    <h2 className="uppercase font-bold text-left flex flex-1 items-center">
      {title}
    </h2>
  );
}
