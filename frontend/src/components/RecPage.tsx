import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Stack
} from "@mui/material";
import { useAppDispatch } from "../store";
import { setRecords } from "../store/recSlice";
import { OpenApiService } from "../services/openapi";
import CreateDialog from "./rec/CreateDialog";
import RecordsTable from "./rec/RecordsTable";
import FilterConfig from "./rec/FilterConfig";
import SorterConfig from "./rec/SorterConfig";

export default function RecPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const f = async () => {
      try {
        dispatch(setRecords(await OpenApiService.getAllRecords()));
        setLoading(false);
      }
      catch (ex: any) { alert(ex?.message); }
    };

    if (loading) { f(); }
  }, [dispatch, loading]);

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
      {loading
        ? <Box display={"flex"} justifyContent={"center"}>
            <CircularProgress />
          </Box>
        : <RecordsTable />
      }
    </Stack>
  );
}
