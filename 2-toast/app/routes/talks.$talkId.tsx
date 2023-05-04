import { json, type DataFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getTalk } from "../data";

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.talkId, "missing talkId param");

  const talk = await getTalk(params.talkId);
  if (!talk) {
    throw new Response("Contact not found", { status: 404 });
  }

  return json({ talk });
}

export default function Talk() {
  const { talk } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center">
        <div className="w-32 font-medium">First Name</div>
        <div>{talk.firstName}</div>
      </div>
      <div className="flex items-center">
        <div className="w-32 font-medium">Last Name</div>
        <div>{talk.lastName}</div>
      </div>
      <div className="flex items-center">
        <div className="w-32 font-medium">Avatar</div>
        <div>{talk.avatar}</div>
      </div>
      <div className="flex items-center">
        <div className="w-32 font-medium">Favorite</div>
        <input type="checkbox" disabled checked={talk.favorite} />
      </div>
      <div className="flex items-center">
        <div className="w-32 font-medium">Github</div>
        <div className="grow font-medium">{talk.github}</div>
      </div>
      <div className="flex items-center">
        <div className="w-32 font-medium">Notes</div>
        <div>{talk.notes}</div>
      </div>
      <div className="ml-32 flex justify-between border-t-2 py-4">
        <Form action="edit">
          <button
            className="rounded-sm border px-4 py-2 active:bg-gray-100"
            type="submit"
          >
            Edit
          </button>
        </Form>
        <Form method="post" action="destroy" replace>
          <button
            className="rounded-sm border px-4 py-2 active:bg-gray-100"
            type="submit"
            onClick={(event) => {
              if (!confirm("Are you sure?")) {
                event.preventDefault();
              }
            }}
          >
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}
