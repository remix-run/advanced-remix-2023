import {
  Meta,
  Links,
  Scripts,
  Outlet,
  ScrollRestoration,
  LiveReload,
} from "@remix-run/react";

import stylesHref from "./tw.css";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/github-markdown-css@4.0.0/github-markdown.css"
        />
        <link rel="stylesheet" href={stylesHref} />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <p>Let's do some caching!</p>
        </header>
        <div className="markdown-body">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
