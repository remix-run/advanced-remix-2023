export function Icon({ id }: { id: string }) {
  return (
    <svg className="h-4 w-4">
      <use href={`/sprite.svg#${id}`} />
    </svg>
  );
}
