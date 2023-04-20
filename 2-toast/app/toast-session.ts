import { createCookieSessionStorage } from "@remix-run/node";

export type ToastMessage = {
  content: string;
  type: "info" | "error";
  id: string;
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

let toastSessionKey = "toast";

export function getToastSession(request: Request) {
  async function getSession() {
    let cookieHeader = request.headers.get("Cookie");
    return sessionStorage.getSession(cookieHeader);
  }

  async function getMessages() {
    let session = await getSession();
    return JSON.parse(session.get(toastSessionKey) || "[]") as ToastMessage[];
  }

  let nextMessages: ToastMessage[] = [];

  return {
    getMessages,

    async commit() {
      let session = await getSession();
      session.flash(toastSessionKey, JSON.stringify(nextMessages));
      return sessionStorage.commitSession(session);
    },

    add(toastMessage: Omit<ToastMessage, "id">) {
      let id = Math.random().toString(32).slice(2, 8);
      nextMessages.unshift({ id, ...toastMessage });
    },
  };
}
