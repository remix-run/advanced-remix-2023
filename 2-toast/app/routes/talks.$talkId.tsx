import { json, type DataFunctionArgs } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { updateTalk, getTalk, type TalkRecord } from "../data";

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.talkId, "missing talkId param");

  const talk = await getTalk(params.talkId);
  if (!talk) {
    throw new Response("Contact not found", { status: 404 });
  }

  return json({ talk });
}

export async function action({ params, request }: DataFunctionArgs) {
  invariant(params.talkId, "missing talkId param");
  const formData = await request.formData();
  const favorite = formData.get("favorite") === "true";
  return updateTalk(params.talkId, { favorite });
}

export default function Talk() {
  const { talk } = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <div>
        <img key={talk.avatar} src={talk.avatar} />
      </div>

      <div>
        <h1>
          {talk.firstName || talk.lastName ? (
            <>
              {talk.firstName} {talk.lastName}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite talk={talk} />
        </h1>

        {talk.github && (
          <p>
            <a
              className="github-link"
              target="_blank"
              href={`https://github.com/${talk.github}`}
              rel="noreferrer"
            >
              {talk.github}
            </a>
          </p>
        )}

        {talk.notes && <p>{talk.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form method="post" action="destroy" replace>
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ talk }: { talk: TalkRecord }) {
  const fetcher = useFetcher<typeof action>();
  let favorite = talk.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
      <button
        type="submit"
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
