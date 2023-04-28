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
  async function getMessages(): Promise<ToastMessage[]> {
    return Promise.resolve([]);
  }

  async function commit(): Promise<string> {
    return Promise.resolve("");
  }

  function add(toastMessage: ToastMessage): void {
    // ...
  }

  return { getMessages, commit, add };
}
