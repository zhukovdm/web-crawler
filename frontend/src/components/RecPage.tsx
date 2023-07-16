import { Box } from "@mui/material";
import CreateRecord from "./rec/CreateRecord";

export default function RecPage(): JSX.Element {
  return (
    <Box sx={{ m: 4 }}>
      <CreateRecord />
    </Box>
  );
}
