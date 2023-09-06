import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { ExecutionType } from "../domain/types";
import { OpenApiService } from "../services/openapi";
import LoadStub from "./_shared/LoadStub";
import FilterConfig from "./exe/FilterConfig";
import ExecutionsTable from "./exe/ExecutionsTable";

export default function ExePage(): JSX.Element {

  const [load, setLoad] = useState(true);
  const [exes, setExes] = useState<ExecutionType[]>([]);

  useEffect(() => {
    let ignore = false;

    const f = async () => {
      try {
        const exes = await OpenApiService.getAllExecutions();
        if (!ignore) { setExes(exes); }
      }
      catch (ex: unknown) { alert(ex); }
      finally {
        if (!ignore) { setLoad(false); }
      }
    };

    f();
    return () => { ignore = true; };
  }, []);

  return (
    <Stack sx={{ m: 4 }} gap={4}>
      <FilterConfig load={load} exes={exes} />
      <Divider light />
      {load
        ? <LoadStub />
        : <ExecutionsTable exes={exes} />
      }
    </Stack>
  );
}
