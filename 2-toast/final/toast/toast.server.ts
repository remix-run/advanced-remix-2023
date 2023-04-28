import { createCookieSessionStorage } from "@remix-run/node";

export type ToastMessage = {
  content: string;
  type: "info" | "error";
};

let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["please use a process.env value here"],
  },
});

export function addToast(
  request: Request,
  toastMessage: ToastMessage
): Promise<string> {
  let toasts = getToastSession(request);
  toasts.add(toastMessage);
  return toasts.commit();
}

export function getToastSession(request: Request) {
  let nextMessages: ToastMessage[] = [];

  async function getMessages(): Promise<ToastMessage[]> {
    let cookie = request.headers.get("Cookie");
    let session = await sessionStorage.getSession(cookie);
    let messages = JSON.parse(session.get("toasts") || "[]") as ToastMessage[];
    return messages;
  }

  async function commit(): Promise<string> {
    let cookie = request.headers.get("Cookie");
    let session = await sessionStorage.getSession(cookie);
    session.flash("toasts", JSON.stringify(nextMessages));
    return sessionStorage.commitSession(session);
  }

  function add(toastMessage: ToastMessage): void {
    nextMessages.unshift(toastMessage);
  }

  return { getMessages, commit, add };
}
