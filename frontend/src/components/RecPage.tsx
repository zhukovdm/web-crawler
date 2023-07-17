import { useEffect, useState } from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import { RecordFullType } from "../domain/types";
import { OpenApiService } from "../services/openapi";
import CreateDialog from "./rec/CreateDialog";
import RecordsTable from "./rec/RecordsTable";

export default function RecPage(): JSX.Element {

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<RecordFullType[]>([]);

  useEffect(() => {
    const f = async () => {
      try {
        setRecords(await OpenApiService.getAllRecords());
        setLoading(false);
      }
      catch (ex: any) { alert(ex?.message); }
    };

    if (loading) { f(); }
  }, [loading]);

  return (
    <Stack sx={{ m: 4 }} gap={4}>
      <CreateDialog />
      {loading
        ? <Box display={"flex"} justifyContent={"center"}>
            <CircularProgress />
          </Box>
        : <RecordsTable records={records} />
      }
    </Stack>
  );
}
