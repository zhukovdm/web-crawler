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
      <Stack gap={2}>
        <Box>
          <Typography>
            Manage website records at&nbsp;<Link to={"/rec"} component={RouterLink}>Records</Link>.
          </Typography>
        </Box>
        <Box>
          <Typography>
            Inspect individual executions at&nbsp;<Link to={"/exe"} component={RouterLink}>Executions</Link>.
          </Typography>
        </Box>
        <Box>
          <Typography>
            See the graph of ongoing executions at&nbsp;<Link to={"/vis"} component={RouterLink}>Visualisation</Link>.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
