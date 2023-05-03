import invariant from "tiny-invariant";
import { redirect, type DataFunctionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import { getTalk, updateTalk } from "../data";

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.talkId, "missing talkId param");

  const talk = await getTalk(params.talkId);
  if (!talk) {
    throw new Response("contact not found", { status: 404 });
  }

  return talk;
}

export async function action({ params, request }: DataFunctionArgs) {
  invariant(params.talkId, "missing talkId param");

  const formData = await request.formData();

  await updateTalk(params.talkId, {
    avatar: String(formData.get("avatar")),
    firstName: String(formData.get("firstName")),
    lastName: String(formData.get("lastName")),
    notes: String(formData.get("notes")),
    github: String(formData.get("github")),
  });

  return redirect(`/talks/${params.talkId}`);
}

export default function EditContact() {
  const contact = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSaving = navigation.formData?.get("intent") === "edit";

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          autoFocus
          placeholder="First"
          aria-label="First name"
          type="text"
          name="firstName"
          defaultValue={contact.firstName}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="lastName"
          defaultValue={contact.lastName}
        />
      </p>
      <label>
        <span>GitHub</span>
        <input
          type="text"
          name="github"
          placeholder="@jack"
          defaultValue={contact.github}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit" name="intent" value="edit">
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
