import React from "react";
import { useRouteData, Link } from "@remix-run/react";

export function headers() {
  return {
    "cache-control":
      // - browser for 10 minutes
      // - CDN weekly (can purge if needed)
      // - Serve cache when rebuilding for always fast responses
      "public, max-age=600, s-maxage=604800 stale-while-revalidate=31540000000",
  };
}

export function meta() {
  return {
    title: "Remix Demo | GitHub Releases",
    description: "Check out the releases from any repo on GitHub.",
  };
}

export default function Index() {
  let data = useRouteData();
  return (
    <div>
      <h1>
        GitHub Releases <a href="https://remix.run">Remix</a> Demo
      </h1>
      <form>
        <label htmlFor="q">Search GitHub Repositories:</label>
        <div>
          <input
            id="q"
            type="text"
            name="q"
            defaultValue={data ? data.query : undefined}
          />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `document.getElementById("q").select();`,
            }}
          />
          <button type="submit">
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
      </form>
      {data ? (
        <>
          <hr />
          <p>
            Showing {data.items.length} of {data.total_count.toLocaleString()}{" "}
            results.
          </p>
          <ul>
            {data.items.map((repo) => (
              <li key={repo.id}>
                <Link to={repo.full_name}>{repo.full_name}</Link>{" "}
                <span>★ {repo.stargazers_count.toLocaleString()}</span>
                <br />
                <span>{repo.description}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>
          <Link to="/?q=reach+ui">reach ui</Link>
        </p>
      )}
    </div>
  );
}
