import { Link, useRouteError } from "react-router-dom";
import { Button, Stack } from "@mui/material";

function Error404() {
  const error =  useRouteError()
  return (
    <div>
      {/* <Stack  spacing={2}> */}
        <Stack spacing={2}  direction={"row"}>
      <Button color="error"  variant="contained">mybutton</Button>
      <Button size="large" color="inherit"  variant="contained">mybutton</Button>
      <Button size="small" color="secondary"  variant="contained">mybutton</Button>
      <Button color="info"  variant="contained">mybutton</Button>
      <Button color="success"  variant="contained">mybutton</Button>
      <Button color="warning"  variant="contained">mybutton</Button>

        </Stack>

      <h1>404 Not Found</h1>
      <h1>{error?.status}</h1>
      <h1>{error?.message}</h1>
      <h1>{JSON.stringify(error)}</h1>
      <Link to={"/"}>Home</Link>
    </div>
  );
}

export default Error404;
