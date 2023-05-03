import { type LoaderArgs, json, redirect } from "@remix-run/node";
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useSubmit,
  useNavigation,
  useFetchers,
} from "@remix-run/react";
import * as React from "react";

import type { TalkRecord } from "../data";
import { createEmptyTalk, getTalks } from "../data";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const talks = await getTalks(q);
  return json({ talks, q });
}

export async function action() {
  const talk = await createEmptyTalk();
  return redirect(`/talks/${talk.id}/edit`);
}

export default function Root() {
  const { talks, q } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  React.useEffect(() => {
    const input = document.getElementById("q");
    if (input && input instanceof HTMLInputElement && q) {
      input.value = q;
    }
  }, [q]);

  return (
    <div id="root">
      <div id="sidebar">
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
          {talks.length ? (
            <ul>
              {talks.map((talk) => (
                <li key={talk.id}>
                  <NavLink
                    prefetch="intent"
                    to={talk.id}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {talk.firstName || talk.lastName ? (
                      <>
                        {talk.firstName} {talk.lastName}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    <OptimisticFavorite talk={talk} />
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No talks</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}

function OptimisticFavorite({ talk }: { talk: TalkRecord }) {
  const fetchers = useFetchers();

  // start with the default case, read the actual data.
  let isFavorite = talk.favorite;

  // Now check if there are any pending fetchers that are changing this contact
  for (const fetcher of fetchers) {
    if (fetcher.formAction === `/talks/${talk.id}`) {
      // Ask for the optimistic version of the data
      isFavorite = fetcher.formData.get("favorite") === "true";
    }
  }

  // Now the star in the sidebar will immediately update as the user clicks
  // instead of waiting for the network to respond
  return isFavorite ? <span>★</span> : null;
}
