import { Box, Button } from "@mui/material";
import { RecordBaseType } from "../../domain/types";
import { OpenApiService } from "../../services/openapi";
import { useAppDispatch } from "../../store";
import { appendRecord, setLoading } from "../../store/recSlice";
import RecordDialog from "./RecordDialog";
import { useState } from "react";

export default function CreateDialog(): JSX.Element {

  const dispatch = useAppDispatch();

  const [show, setShow] = useState(false);

  const callback = async (record: RecordBaseType) => {
    dispatch(setLoading(true));
    try {
      const res = await OpenApiService.createRecord(record);
      dispatch(appendRecord({
        ...res,
        ...record,
        lastExecStatus: null,
        lastExecCreateTime: null,
        lastExecFinishTime: null,
      }));
      setShow(false);
    }
    catch (ex: any) { alert(ex.message); }
    finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box>
      <Button variant={"outlined"} onClick={() => setShow(true)}>
        Create record
      </Button>
      <RecordDialog show={show} hide={() => setShow(false)} action={"create"} callback={callback} />
    </Box>
  );
}
