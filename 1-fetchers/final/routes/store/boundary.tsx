import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export function ErrorBoundary() {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-center">
        <div>
          <h2 className="font-bold">
            {error.status} | {error.statusText}
          </h2>
          <pre>{error.data}</pre>
        </div>
      </div>
    );
  }

  throw error;
}
