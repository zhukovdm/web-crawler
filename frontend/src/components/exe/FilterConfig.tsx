import {
  Stack,
  Typography
} from "@mui/material";

export default function FilterConfig(): JSX.Element {
  return (
    <Stack direction={"column"} gap={2}>
      <Typography fontSize={"large"}>Filters</Typography>
    </Stack>
  );
}
