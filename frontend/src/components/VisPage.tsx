import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Stack
} from "@mui/material";
import { useAppDispatch } from "../store";
import { setWebsites } from "../store/visSlice";
import { GraphQlService } from "../services/graphql";
import WebsitesTable from "./vis/WebsitesTable";
import Visualisation from "./vis/Visualisation";

export default function VisPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const f = async () => {
      try {
        dispatch(setWebsites(await GraphQlService.getWebsites()));
        setLoad(false);
      }
      catch (ex: any) { alert(ex?.message); }
    }

    if (load) { f(); }
  }, [dispatch, load]);

  return (
    <Box sx={{ m: 4 }}>
      {load
        ? <Box display={"flex"} justifyContent={"center"}>
            <CircularProgress />
          </Box>
        : <Stack gap={4}>
            <WebsitesTable />
            <Visualisation />
          </Stack>
      }
    </Box>
  );
}
