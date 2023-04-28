import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact } from "../data";
import { addToast } from "../toast/toast.server";

export async function action({ request, params }: ActionArgs) {
  invariant(params.contactId, "Missing contactId param");

  let contact = await deleteContact(params.contactId);

  let cookie = await addToast(request, {
    type: "info",
    content: `Deleted ${contact.firstName}`,
  });

  return redirect("/", {
    headers: { "Set-Cookie": cookie },
  });
}
