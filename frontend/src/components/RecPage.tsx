import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useAppDispatch } from "../store";
import { setRecords } from "../store/recSlice";
import { OpenApiService } from "../services/openapi";
import LoadStub from "./_shared/LoadStub";
import CreateDialog from "./rec/CreateDialog";
import RecordsTable from "./rec/RecordsTable";
import FilterConfig from "./rec/FilterConfig";
import SorterConfig from "./rec/SorterConfig";

export default function RecPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    let ignore = false;

    const f = async () => {
      try {
        const recs = await OpenApiService.getAllRecords();
        if (!ignore) { dispatch(setRecords(recs)); }
      }
      catch (ex: unknown) { alert(ex); }
      finally {
        if (!ignore) { setLoad(false); }
      }
    };

    f();
    return () => { ignore = true };
  }, [dispatch]);

  return (
    <Stack sx={{ m: 4 }} gap={4}>
      <Stack direction={"row"} gap={4}>
        <Stack direction={"column"} gap={4}>
          <CreateDialog />
          <Divider light />
          <SorterConfig />
        </Stack>
        <Divider orientation={"vertical"} flexItem />
        <FilterConfig />
      </Stack>
      <Divider light />
      {load
        ? <LoadStub />
        : <RecordsTable />
      }
    </Stack>
  );
}
