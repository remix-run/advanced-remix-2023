import {
  Outlet,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

export default Outlet;

export function ErrorBoundary() {
  let error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>
        <i>
          {isRouteErrorResponse(error)
            ? error.statusText
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </i>
      </p>
      <Link to="/">Go Home</Link>
    </div>
  );
}
