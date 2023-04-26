import React from "react";
import { Meta, Scripts, Styles, Routes } from "@remix-run/react";
import { Link } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <Meta />
        <link rel="shortcut icon" href="/_static/favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/github-markdown-css@4.0.0/github-markdown.css"
        />
        <Styles />
      </head>
      <body>
        <header>
          This is a <a href="https://remix.run">Remix</a> demo deployed to
          Amazon AWS with <a href="https://arc.codes">Architect</a>, using{" "}
          <a href="https://fastly.com">Fastly</a> as a CDN.
          <p>
            <Link to="/?q=reach+ui">reach ui</Link>
          </p>
        </header>

        <div className="markdown-body">
          <Routes />
        </div>

        <Scripts />
      </body>
    </html>
  );
}
