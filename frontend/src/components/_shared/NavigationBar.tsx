import { Link as ReactLink } from "react-router-dom";
import {
  Box,
  Link,
  Stack,
  Typography
} from "@mui/material";

type NavigationLinkType = {
  address: string;
  element: JSX.Element
}

function NavigationLink({ address, element }: NavigationLinkType): JSX.Element {
  return (
    <Link component={ReactLink} to={address} underline={"hover"}>
      {element}
    </Link>
  );
}

export default function NavigationBar(): JSX.Element {
  return (
    <Stack
      gap={2}
      direction={"row"}
      alignItems={"baseline"}
    >
      <Box sx={{ mx: 2, my: 1 }}>
        <NavigationLink address={"/"} element={
          <Typography fontSize={"large"} fontWeight={"bold"}>
            Web Crawler
          </Typography>
        } />
      </Box>
      <NavigationLink address={"/rec"} element={
        <Typography>Records</Typography>
      } />
      <NavigationLink address={"/exe"} element={
        <Typography>Executions</Typography>
      } />
      <NavigationLink address={"/vis"} element={
        <Typography>Visualisation</Typography>
      } />
    </Stack>
  );
}
