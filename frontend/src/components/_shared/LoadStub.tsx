import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadStub(): JSX.Element {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <CircularProgress />
    </Box>
  );
}
