import { Icon } from "./icon";

export function Spinner({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={[
        `h-full w-full animate-spin text-pink-600 transition-opacity`,
        hidden ? "opacity-0" : "opacit-100",
      ].join(" ")}
    >
      <Icon id="arrows" />
    </div>
  );
}
