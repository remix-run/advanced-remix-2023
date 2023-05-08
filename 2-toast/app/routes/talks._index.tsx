import invariant from "tiny-invariant";
import { redirect, type DataFunctionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import { createTalk } from "../data";

export async function action({ params, request }: DataFunctionArgs) {
  const formData = await request.formData();

  const talk = await createTalk({
    firstName: String(formData.get("firstName")),
    lastName: String(formData.get("lastName")),
    github: String(formData.get("github")),
    avatar: String(formData.get("avatar")),
    favorite: formData.get("favorite") === "on",
    notes: String(formData.get("notes")),
  });

  return redirect(`/talks/${talk.id}`);
}

export default function EditContact() {
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
          className="grow rounded-sm border-gray-300"
        />
      </p>
      <label className="flex items-center">
        <span className="w-32">GitHub</span>
        <input
          type="text"
          name="github"
          className="grow rounded-sm border-gray-300"
        />
      </label>
      <label className="flex items-center">
        <span className="w-32">Avatar</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar"
          type="text"
          name="avatar"
          className="grow rounded-sm border-gray-300"
        />
      </label>
      <label className="flex items-center">
        <span className="w-32">Favorite</span>
        <input
          aria-label="Favorite"
          type="checkbox"
          name="favorite"
          className="border-gray-300"
        />
      </label>
      <label className="flex">
        <span className="w-32 pt-1">Notes</span>
        <textarea
          name="notes"
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
      </p>
    </Form>
  );
}
