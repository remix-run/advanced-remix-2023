import type { DataFunctionArgs, V2_MetaFunction } from "@remix-run/node";
import { defer, json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { updateContact, getContact, type ContactRecord } from "~/data";

export let meta: V2_MetaFunction = ({ data }) => {
  if (!data.contact) {
    return [{ title: "Not Found" }];
  }

  return [
    {
      title: data.contact.firstName,
    },
  ];
};

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.contactId, "missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Contact not found", { status: 404 });
  }

  return json({ contact });
}

export async function action({ params, request }: DataFunctionArgs) {
  invariant(params.contactId, "missing contactId param");
  const formData = await request.formData();
  const favorite = formData.get("favorite") === "true";
  return updateContact(params.contactId, { favorite });
}

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar} />
      </div>

      <div>
        <h1>
          {contact.firstName || contact.lastName ? (
            <>
              {contact.firstName} {contact.lastName}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.github && (
          <p>
            <a
              className="github-link"
              target="_blank"
              href={`https://github.com/${contact.github}`}
              rel="noreferrer"
            >
              {contact.github}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: ContactRecord }) {
  const fetcher = useFetcher<typeof action>();
  let favorite = contact.favorite;
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
