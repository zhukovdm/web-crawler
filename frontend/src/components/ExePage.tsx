import { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Stack
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector
} from "../store";
import {
  setExecutions,
  setGetAllAction
} from "../store/exeSlice";
import { OpenApiService } from "../services/openapi";
import FilterConfig from "./exe/FilterConfig";
import ExecutionsTable from "./exe/ExecutionsTable";

export default function ExePage(): JSX.Element {

  const dispatch = useAppDispatch();
  const { getAllAction } = useAppSelector((state) => state.exe);

  useEffect(() => {
    const f = async () => {
      try {
        dispatch(setExecutions(await OpenApiService.getAllExecutions()));
        dispatch(setGetAllAction(false));
      }
      catch (ex: any) { alert(ex?.message); }
    };

    if (getAllAction) { f(); }
  }, [dispatch, getAllAction]);

  return (
    <Stack sx={{ m: 4 }} gap={4}>
      <FilterConfig />
      <Divider light />
      {getAllAction
        ? <Box display={"flex"} justifyContent={"center"}>
            <CircularProgress />
          </Box>
        : <ExecutionsTable />
      }
    </Stack>
  );
}
