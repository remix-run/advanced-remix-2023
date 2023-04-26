import React from "react";
import { useRouteData } from "@remix-run/react";
import { Link } from "react-router-dom";
import Chevron from "../Chevron";

export function headers({ loaderHeaders }) {
  return {
    // - browser 5 minutes
    // - CDN once a month, it's a bunch of release notes
    // update it once a month, everybody gets a super fast cached copy, no rebuilds!
    "cache-control": loaderHeaders.get("cache-control"),
  };
}

export function meta({ data }) {
  return {
    title: `${data.repo.name} ${data.release.tag_name} | Remix Demo`,
  };
}

export default function Release() {
  let data = useRouteData();
  return (
    <div>
      <nav>
        <Link to="/">Search Repos</Link> <Chevron />
        <Link to="../">{data.repo.full_name}</Link> <Chevron />
        {data.release.tag_name}
      </nav>
      <h1>{data.release.tag_name} Release Notes</h1>
      {data.html ? (
        <main dangerouslySetInnerHTML={{ __html: data.html }} />
      ) : (
        <main>
          <p>
            No release notes found. Bummer. I really would have liked to know
            what they put into this release.
          </p>
        </main>
      )}
    </div>
  );
}
