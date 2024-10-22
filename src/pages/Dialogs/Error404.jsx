import { Link, useRouteError } from "react-router-dom";
import { Button, Stack } from "@mui/material";

function Error404() {
  const error =  useRouteError()
  return (
    <div>
      {/* <Stack  spacing={2}> */}
       

      <h1>404 Not Found</h1>
      <h1>{error?.status}</h1>
      <h1>{error?.message}</h1>
      <div>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.statusText || "An unexpected error occurred."}</p>
      {error.message && (
        <p><strong>Error Details:</strong> {error.message}</p>
      )}
      {error.stack && (
        <details>
          <summary>Stack Trace</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
      <h1>{JSON.stringify(error)}</h1>
      <Link to={"/"}>Home</Link>
    </div>
  );
}

export default Error404;
