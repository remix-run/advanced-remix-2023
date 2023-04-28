import { useLoaderData, Link } from "@remix-run/react";
import { type V2_MetaArgs, json, LoaderArgs } from "@remix-run/node";
import { Chevron } from "../chevron";
import { fetchGitHub, fetchMarkdown } from "../gh-fetch";
import invariant from "tiny-invariant";

export async function loader({ params }: LoaderArgs) {
  let [{ release, html }, repo] = await Promise.all([
    fetchGitHub(
      `/repos/${params.org}/${params.repo}/releases/tags/${params.release}`
    ).then(async (release) => {
      invariant(params.org && params.repo, "Missing org or repo.");
      let html = await fetchMarkdown({
        md: release.body,
        repo: params.repo,
        org: params.org,
      });
      return { html, release: { tag_name: release.tag_name } };
    }),
    fetchGitHub(`/repos/${params.org}/${params.repo}`),
  ]);

  return json({ html, release, repo });
}

export function meta({ data }: V2_MetaArgs) {
  return [
    {
      title: `${data.repo.name} ${data.release.tag_name} | Remix Demo`,
    },
  ];
}

export default function Release() {
  let data = useLoaderData();
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
