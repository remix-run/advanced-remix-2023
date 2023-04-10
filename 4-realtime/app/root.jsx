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
        <link rel="stylesheet" href={stylesHref} />
        <Meta />
        <Links />
      </head>
      <body>
        <h1 className="text-blue-600">Hello World</h1>
        <Outlet />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
