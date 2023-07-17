import { Box } from "@mui/material";
import CreateDialog from "./rec/CreateDialog";

export default function RecPage(): JSX.Element {

  return (
    <Box sx={{ m: 4 }}>
      <CreateDialog />
    </Box>
  );
}
