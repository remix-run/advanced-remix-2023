import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact } from "../data";
import { getToastSession } from "../toast-session";

export async function action({ request, params }: ActionArgs) {
  invariant(params.contactId, "Missing contactId param");

  let contact = await deleteContact(params.contactId);

  let toastSession = getToastSession(request);
  toastSession.add({ type: "info", content: `Deleted ${contact.firstName}` });
  let cookie = await toastSession.commit();

  return redirect("/", { headers: { "Set-Cookie": cookie } });
}
