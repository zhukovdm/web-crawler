import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Stack
} from "@mui/material";
import { ExecutionFullType } from "../domain/types";
import { OpenApiService } from "../services/openapi";
import FilterConfig from "./exe/FilterConfig";
import ExecutionsTable from "./exe/ExecutionsTable";

export default function ExePage(): JSX.Element {

  const [load, setLoad] = useState(true);
  const [exes, setExes] = useState<ExecutionFullType[]>([]);

  useEffect(() => {
    const f = async () => {
      try {
        setExes(await OpenApiService.getAllExecutions());
        setLoad(false);
      }
      catch (ex: any) { alert(ex?.message); }
    };

    f();
  }, []);

  return (
    <Stack sx={{ m: 4 }} gap={4}>
      <FilterConfig load={load} exes={exes} />
      <Divider light />
      {load
        ? <Box display={"flex"} justifyContent={"center"}>
            <CircularProgress />
          </Box>
        : <ExecutionsTable exes={exes} />
      }
    </Stack>
  );
}
