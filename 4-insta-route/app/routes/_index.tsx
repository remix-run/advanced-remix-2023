import { Link, useLoaderData } from "@remix-run/react";

export function loader() {
  return [
    { id: 1, name: "Ryan", seat: "33D" },
    { id: 2, name: "Liam", seat: "33E" },
  ];
}

export default function IndexRoute() {
  let data = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>Index</h2>
      {data.map((item) => (
        <div key={item.id}>
          <Link state={{ rootModal: true }} to={`ticket/${item.id}`}>
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
