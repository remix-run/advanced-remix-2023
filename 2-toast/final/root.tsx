import { LoaderArgs, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useSubmit,
  useNavigation,
  useFetchers,
} from "@remix-run/react";
import * as React from "react";

import appStylesHref from "./app.css";
import toastStyles from "./toast/toast.css";
import type { ContactRecord } from "./data";
import { createEmptyContact, getContacts } from "./data";
import { Toast } from "./toast/toast";
import { getToastSession } from "./toast/toast.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const contacts = await getContacts(q);
  const toasts = getToastSession(request);
  const messages = await toasts.getMessages();

  return json(
    { contacts, q, toastMessages: messages },
    {
      headers: {
        "Set-Cookie": await toasts.commit(),
      },
    }
  );
}

export async function action() {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts, q, toastMessages } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true));

  React.useEffect(() => {
    const input = document.getElementById("q");
    if (input && input instanceof HTMLInputElement && q) {
      input.value = q;
    }
  }, [q]);

  return (
    <html lang="en" className={hydrated ? "js" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={appStylesHref} />
        <link rel="stylesheet" href={toastStyles} />
        <Meta />
        <Links />
      </head>
      <body>
        <Toast serverMessages={toastMessages} />

        <div id="root">
          <div id="sidebar">
            <h1>Remix Contacts</h1>
            <div>
              <Form
                id="search-form"
                role="search"
                onSubmit={(event) => {
                  // this form is submitted as the user types with JS, if they
                  // hit "enter" we want to prevent submitting a useless search.
                  // If JS hasn't loaded in the browser yet, hitting enter will
                  // work.
                  event.preventDefault();
                }}
              >
                <input
                  id="q"
                  className={searching ? "loading" : ""}
                  aria-label="Search contacts"
                  placeholder="Search"
                  type="search"
                  name="q"
                  defaultValue={q}
                  onChange={(event) => {
                    const isSubsequentSearch = q != null;
                    submit(event.currentTarget.form, {
                      // If this is the first search, push a new entry into the
                      // history stack so the user can click back to no search.
                      // If it's a subsequent search, replace the current
                      // location so the user doesn't have click "back" for
                      // every daggum character they've typed
                      replace: isSubsequentSearch,
                    });
                  }}
                />
                <div id="search-spinner" aria-hidden hidden={!searching} />
              </Form>
              <Form method="post">
                <button type="submit">New</button>
              </Form>
            </div>
            <nav>
              {contacts.length ? (
                <ul>
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <NavLink
                        prefetch="intent"
                        to={`contacts/${contact.id}`}
                        className={({ isActive, isPending }) =>
                          isActive ? "active" : isPending ? "pending" : ""
                        }
                      >
                        {contact.firstName || contact.lastName ? (
                          <>
                            {contact.firstName} {contact.lastName}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        <OptimisticFavorite contact={contact} />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <i>No contacts</i>
                </p>
              )}
            </nav>
          </div>
          <div id="detail">
            <Outlet />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function OptimisticFavorite({ contact }: { contact: ContactRecord }) {
  const fetchers = useFetchers();

  // start with the default case, read the actual data.
  let isFavorite = contact.favorite;

  // Now check if there are any pending fetchers that are changing this contact
  for (const fetcher of fetchers) {
    if (fetcher.formAction === `/contacts/${contact.id}`) {
      // Ask for the optimistic version of the data
      isFavorite = fetcher.formData.get("favorite") === "true";
    }
  }

  // Now the star in the sidebar will immediately update as the user clicks
  // instead of waiting for the network to respond
  return isFavorite ? <span>★</span> : null;
}
