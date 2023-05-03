import { redirect, type ActionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteTalk } from "../data";

export async function action({ params }: ActionArgs) {
  invariant(params.talkId, "Missing talkId param");

  await deleteTalk(params.talkId);

  return redirect("/talks");
}
