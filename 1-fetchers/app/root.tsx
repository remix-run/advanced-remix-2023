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
        <h1 className="my-10 text-center text-4xl font-black uppercase text-green-800 drop-shadow-md">
          .~* Bussin Drip *~.
        </h1>
        <Outlet />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
