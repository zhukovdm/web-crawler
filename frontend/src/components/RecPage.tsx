import { useEffect } from "react";
import { Box, CircularProgress, Divider, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store";
import { setGetAllAction, setRecords } from "../store/recSlice";
import { OpenApiService } from "../services/openapi";
import CreateDialog from "./rec/CreateDialog";
import RecordsTable from "./rec/RecordsTable";
import FilterConfig from "./rec/FilterConfig";

export default function RecPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const { getAllAction } = useAppSelector((state) => state.rec);

  useEffect(() => {
    const f = async () => {
      try {
        dispatch(setRecords(await OpenApiService.getAllRecords()));
        dispatch(setGetAllAction(false));
      }
      catch (ex: any) { alert(ex?.message); }
    };

    if (getAllAction) { f(); }
  }, [dispatch, getAllAction]);

  return (
    <Stack sx={{ m: 4 }} gap={4}>
      <CreateDialog />
      <Divider light />
      <FilterConfig />
      <Divider light />
      {getAllAction
        ? <Box display={"flex"} justifyContent={"center"}>
            <CircularProgress />
          </Box>
        : <RecordsTable />
      }
    </Stack>
  );
}
