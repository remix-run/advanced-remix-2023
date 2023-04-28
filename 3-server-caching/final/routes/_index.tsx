import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link, Form, useNavigation } from "@remix-run/react";
import { fetchGitHub } from "../gh-fetch";
import { useRef } from "react";

export async function loader({ request }: LoaderArgs) {
  let url = new URL(request.url);
  let query = url.searchParams.get("q");
  if (!query) return null;

  let now = Date.now();
  let result = await fetchGitHub(
    `/search/repositories?q=${query}&sort=stars&order=desc`
  );
  let elapsed = Date.now() - now;

  return { query, ...result, queryTime: elapsed };
}

export function meta() {
  return [
    {
      title: "Remix Demo | GitHub Releases",
      description: "Check out the releases from any repo on GitHub.",
    },
  ];
}

export default function Index() {
  let data = useLoaderData<typeof loader>();
  let ref = useRef<HTMLInputElement>(null);
  let navigation = useNavigation();

  return (
    <div>
      <h1>
        GitHub Releases <a href="https://remix.run">Remix</a> Demo
      </h1>
      <Form
        onSubmit={() => {
          ref.current?.select();
        }}
      >
        <label htmlFor="q">Search GitHub Repositories:</label>
        <div>
          <input
            ref={ref}
            id="q"
            type="text"
            name="q"
            defaultValue={data ? data.query : undefined}
          />
          <button type="submit" disabled={navigation.formMethod === "GET"}>
            Search
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </Form>
      {data && (
        <>
          <hr />
          <p>
            Showing {data.items.length} of {data.total_count.toLocaleString()}{" "}
            results in <b>{data.queryTime}ms</b>.
          </p>
          <ul>
            {data.items.map((repo: any) => (
              <li key={repo.id}>
                <Link to={repo.full_name}>{repo.full_name}</Link>{" "}
                <span>★ {repo.stargazers_count.toLocaleString()}</span>
                <br />
                <span>{repo.description}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
