import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavigationBar(): JSX.Element {
  return (
    <Box>
      <Link to={"/"}>
        <Typography>Web Crawler</Typography>
      </Link>
      <Link to={"/rec"}>
        <Typography>Records</Typography>
      </Link>
      <Link to={"/exe"}>
        <Typography>Executions</Typography>
      </Link>
      <Link to={"/vis"}>
        <Typography>Visualization</Typography>
      </Link>
    </Box>
  );
}
