import {
  Meta,
  Links,
  Scripts,
  Outlet,
  ScrollRestoration,
  LiveReload,
  useLoaderData,
  Link,
  useMatches,
  useLocation,
  useNavigate,
  useOutlet,
  UNSAFE_RemixContextObject,
  UNSAFE_RemixContext,
} from "@remix-run/react";
import { useRoutes } from "react-router-dom";

import stylesHref from "./tw.css";
import { useContext, useEffect, useRef, useState } from "react";

function ModalOutlet() {
  let matches = useMatches();
  let location = useLocation();
  let modalMatch = matches.find((match) => match.handle?.Modal);
  let ModalComponent = modalMatch
    ? (modalMatch?.handle?.Modal as React.FunctionComponent<{ data: any }>)
    : null;
  let modalRenderRequested = Boolean(location.state?.rootModal);
  let navigate = useNavigate();

  return modalRenderRequested && modalMatch && ModalComponent ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50"
      onClick={() => navigate(-1)}
    >
      <div className="absolute inset-20 rounded-3xl border bg-white p-10 shadow-2xl">
        <ModalComponent data={modalMatch.data} />
      </div>
    </div>
  ) : (
    <Outlet />
  );
}

function InterceptOutlet() {
  let navigate = useNavigate();
  let ctx = useContext(UNSAFE_RemixContext);
  console.log(ctx);
  // let [old, setOld] = useState({ matches, location });

  // let bgOutlet = useRoutes(old.matches.slice(1), old.location);

  // useEffect(() => {
  //   setOld({ location, matches });
  // }, [location, matches]);

  // console.log(bgOutlet);

  return <Outlet />;
  // return location.state?.rootModal ? (
  //   <>
  //     {bgOutlet}
  //     <hr />
  //     <Outlet />
  //     {/* <div
  //       className="fixed inset-0 bg-black bg-opacity-50"
  //       onClick={() => navigate(-1)}
  //     >
  //       <div className="absolute inset-20 rounded-3xl border bg-white p-10 shadow-2xl">
  //         <Outlet />
  //       </div>
  //     </div> */}
  //   </>
  // ) : (
  //   <Outlet />
  // );
}

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
      <body className="bg-slate-100">
        <h1>Hello World</h1>
        <hr />

        <InterceptOutlet />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
