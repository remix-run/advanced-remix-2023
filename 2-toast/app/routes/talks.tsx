import { type LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import { createEmptyTalk, getTalks } from "../data";

export async function loader({}: LoaderArgs) {
  const talks = await getTalks();
  return json({ talks });
}

export async function action() {
  const talk = await createEmptyTalk();
  return redirect(`/talks/${talk.id}/edit`);
}

export default function Root() {
  const { talks } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen">
      <div className="h-full w-1/4 shrink-0 overflow-auto">
        <nav className="p-4">
          <h1 className="mb-4 text-xl font-bold">Talks</h1>
          <Form method="post" className="mb-4">
            <button
              className="rounded-sm border px-4 py-2 active:bg-gray-100"
              type="submit"
            >
              Create New Talk
            </button>
          </Form>
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
