import invariant from "tiny-invariant";
import { redirect, type DataFunctionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import { deleteTalk, getTalk, updateTalk } from "../data";

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.talkId, "missing talkId param");

  const talk = await getTalk(params.talkId);
  if (!talk) {
    throw new Response("Talk Not Found", { status: 404 });
  }

  return talk;
}

export async function action({ params, request }: DataFunctionArgs) {
  invariant(params.talkId, "missing talkId param");

  const formData = await request.formData();

  if (formData.get("intent") === "delete") {
    await deleteTalk(params.talkId);
    return redirect("/talks");
  }

  if (formData.get("intent") === "edit") {
    await updateTalk(params.talkId, {
      avatar: String(formData.get("avatar")),
      firstName: String(formData.get("firstName")),
      lastName: String(formData.get("lastName")),
      notes: String(formData.get("notes")),
      github: String(formData.get("github")),
    });

    return redirect(`/talks/${params.talkId}`);
  }

  throw new Response("Bad Request", { status: 400 });
}

export default function EditContact() {
  const talk = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSaving = navigation.formData?.get("intent") === "edit";

  return (
    <Form method="post" className="flex max-w-2xl flex-col gap-4 p-4">
      <p className="flex items-center">
        <span className="w-32">First Name</span>
        <input
          autoFocus
          placeholder="First"
          aria-label="First name"
          type="text"
          name="firstName"
          defaultValue={talk.firstName}
          className="grow rounded-sm border-gray-300"
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
          className="grow rounded-sm border-gray-300"
        />
      </p>
      <label className="flex items-center">
        <span className="w-32">GitHub</span>
        <input
          type="text"
          name="github"
          defaultValue={talk.github}
          className="grow rounded-sm border-gray-300"
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
          className="grow rounded-sm border-gray-300"
        />
      </label>
      <label className="flex">
        <span className="w-32 pt-1">Notes</span>
        <textarea
          name="notes"
          defaultValue={talk.notes}
          rows={6}
          className="grow rounded-sm border-gray-300"
        />
      </label>
      <p className="ml-32 flex gap-2">
        <button
          type="submit"
          name="intent"
          value="edit"
          className="rounded-sm border border-gray-300 px-4 py-2 font-medium text-blue-500 active:bg-gray-100"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
          className="rounded-sm border border-gray-300 px-4 py-2 font-medium active:bg-gray-100"
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
