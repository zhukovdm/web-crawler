import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Link,
  Stack,
  Typography
} from "@mui/material";

export default function HomPage(): JSX.Element {
  return (
    <Box sx={{ m: 4 }}>
      <Stack direction={"column"} gap={2}>
        <Box display={"flex"}>
          <Typography>Manage website records at&nbsp;</Typography>
          <Link
            to={"/rec"}
            display={"inline"}
            component={RouterLink}
          >
            <Typography>Records</Typography>
          </Link>
          <Typography>.</Typography>
        </Box>
        <Box display={"flex"}>
          <Typography>Inspect individual executions at&nbsp;</Typography>
          <Link
            to={"/exe"}
            display={"inline"}
            component={RouterLink}
          >
            <Typography>Executions</Typography>
          </Link>
          <Typography>.</Typography>
        </Box>
        <Box display={"flex"}>
          <Typography>See the graph of ongoing executions at&nbsp;</Typography>
          <Link
            to={"/vis"}
            display={"inline"}
            component={RouterLink}
          >
            <Typography>Visualization</Typography>
          </Link>
          <Typography>.</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
