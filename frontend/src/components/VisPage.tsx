import { useEffect } from "react";
import {
  Box,
  Typography
} from "@mui/material";
import { GraphQlService } from "../services/graphql";

export default function VisPage(): JSX.Element {

  useEffect(() => {
    const f = async () => {
      console.log(await GraphQlService.getWebsites());
    }
    f();
  }, []);

  return (
    <Box sx={{ m: 4 }}>
      <Typography>C</Typography>
    </Box>
  );
}
