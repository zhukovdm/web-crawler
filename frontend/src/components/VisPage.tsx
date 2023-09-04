import { useEffect, useState } from "react";
import {
  Box,
  Stack
} from "@mui/material";
import { useAppDispatch } from "../store";
import { setWebsites } from "../store/visSlice";
import { GraphQlService } from "../services/graphql";
import LoadStub from "./_shared/LoadStub";
import NodeDialog from "./vis/NodeDialog";
import WebsitesTable from "./vis/WebsitesTable";
import Visualisation from "./vis/Visualisation";

export default function VisPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    let ignore = false;

    const f = async () => {
      try {
        const webs = await GraphQlService.getWebsites();
        if (!ignore) { dispatch(setWebsites(webs)); }
      }
      catch (ex: any) { alert(ex?.message); }
      finally {
        if (!ignore) { setLoad(false); }
      }
    }

    f();
    return () => { ignore = true; }
  }, [dispatch]);

  return (
    <Box sx={{ m: 4 }}>
      {load
        ? <LoadStub />
        : <Stack gap={4}>
            <NodeDialog />
            <WebsitesTable />
            <Visualisation />
          </Stack>
      }
    </Box>
  );
}
