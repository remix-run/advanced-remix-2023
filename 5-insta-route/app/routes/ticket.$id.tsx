import { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader({ params }: LoaderArgs) {
  return params;
}

export let handle = { Modal };

function Modal({ data }: { data: SerializeFrom<typeof loader> }) {
  return (
    <div>
      <h2>In a modal sucker!</h2>
      <h3>Ticket</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function Ticket() {
  let data = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>Ticket</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
