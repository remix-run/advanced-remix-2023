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
    throw new Response("talk not found", { status: 404 });
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
  const talk = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSaving = navigation.formData?.get("intent") === "edit";

  return (
    <Form method="post" className="flex flex-col max-w-2xl gap-4 p-4">
      <p className="flex items-center">
        <span className="w-32">First Name</span>
        <input
          autoFocus
          placeholder="First"
          aria-label="First name"
          type="text"
          name="firstName"
          defaultValue={talk.firstName}
          className="border-gray-300 rounded-sm grow"
        />
      </p>
      <p className="flex items-center">
        <span className="w-32">Last Name</span>
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="lastName"
          defaultValue={talk.lastName}
          className="border-gray-300 rounded-sm grow"
        />
      </p>
      <label className="flex items-center">
        <span className="w-32">GitHub</span>
        <input
          type="text"
          name="github"
          defaultValue={talk.github}
          className="border-gray-300 rounded-sm grow"
        />
      </label>
      <label className="flex items-center">
        <span className="w-32">Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={talk.avatar}
          className="border-gray-300 rounded-sm grow"
        />
      </label>
      <label className="flex">
        <span className="w-32 pt-1">Notes</span>
        <textarea
          name="notes"
          defaultValue={talk.notes}
          rows={6}
          className="border-gray-300 rounded-sm grow"
        />
      </label>
      <p className="flex gap-2 ml-32">
        <button
          type="submit"
          name="intent"
          value="edit"
          className="px-4 py-2 font-medium text-blue-500 border border-gray-300 rounded-sm active:bg-gray-100"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
          className="px-4 py-2 font-medium border border-gray-300 rounded-sm active:bg-gray-100"
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
