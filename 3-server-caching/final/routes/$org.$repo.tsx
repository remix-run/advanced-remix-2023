import { V2_MetaArgs, type LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { fetchGitHub } from "../gh-fetch";
import { Chevron } from "../chevron";

export async function loader({ params }: LoaderArgs) {
  let [releases, repo] = await Promise.all([
    fetchGitHub(`/repos/${params.org}/${params.repo}/releases`),
    fetchGitHub(`/repos/${params.org}/${params.repo}`),
  ]);
  return { releases, repo };
}

export function meta({ data }: V2_MetaArgs) {
  return [
    {
      title: `Remix Demo | ${data.repo.name} Releases`,
      description: data.repo.description,
    },
  ];
}

export default function Repo() {
  let data = useLoaderData();
  return (
    <div>
      <nav>
        <Link to="/">Search Repos</Link> <Chevron />
        {data.repo.full_name}
      </nav>

      <h1>
        Recent Releases: <a href={data.repo.html_url}>{data.repo.full_name}</a>
      </h1>
      {data.description && <p>{data.repo.description}</p>}
      {data.releases && data.releases.length ? (
        <ul className="tags">
          {data.releases.map((release: any) => (
            <li key={release.id}>
              <Link to={release.tag_name}>{release.tag_name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No releases, bummer.</p>
      )}
    </div>
  );
}
