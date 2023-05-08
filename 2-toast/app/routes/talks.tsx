import { type LoaderArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getTalks } from "../data";

export async function loader({}: LoaderArgs) {
  const talks = await getTalks();
  return json({ talks });
}

export default function Root() {
  const { talks } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen">
      <div className="h-full w-1/4 shrink-0 overflow-auto">
        <nav className="p-4">
          <h1 className="mb-4 text-xl font-bold">Talks</h1>
          <p className="mb-4">
            <Link to="." className="text-blue-500 underline">
              Create new talk
            </Link>
          </p>
          {talks.length ? (
            <ul role="nav" className="pl-4">
              {talks.map((talk) => (
                <li key={talk.id} className="list-disc">
                  <Link to={talk.id} className="underline active:text-blue-500">
                    {talk.id}
                  </Link>
                </li>
              ))}
              {talks.map((talk) => (
                <li key={talk.id} className="list-disc">
                  <Link to={talk.id} className="underline active:text-blue-500">
                    {talk.id}
                  </Link>
                </li>
              ))}
              {talks.map((talk) => (
                <li key={talk.id} className="list-disc">
                  <Link to={talk.id} className="underline active:text-blue-500">
                    {talk.id}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No talks</i>
            </p>
          )}
        </nav>
      </div>

      <main className="border-l-2">
        <Outlet />
      </main>
    </div>
  );
}
