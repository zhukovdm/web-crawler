import { Box, Button } from "@mui/material";
import { RecordBaseType } from "../../domain/types";
import { OpenApiService } from "../../services/openapi";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  appendRecord,
  setCreateAction
} from "../../store/recSlice";
import RecordDialog from "./RecordDialog";
import { useState } from "react";

export default function CreateDialog(): JSX.Element {

  const dispatch = useAppDispatch();
  const { createAction } = useAppSelector((state) => state.rec);

  const [show, setShow] = useState(false);

  const callback = async (createdRecord: RecordBaseType) => {
    dispatch(setCreateAction(true));
    try {
      const res = await OpenApiService.createRecord(createdRecord);
      dispatch(appendRecord({
        ...res,
        ...createdRecord,
        lastExecStatus: null,
        lastExecCreateTime: null,
        lastExecFinishTime: null
      }));
      setShow(false);
    }
    catch (ex: any) { alert(ex?.message); }
    finally {
      dispatch(setCreateAction(false));
    }
  };

  return (
    <Box>
      <Button variant={"outlined"} onClick={() => setShow(true)}>
        Create record
      </Button>
      <RecordDialog
        show={show}
        action={"create"}
        remoteAction={createAction}
        hide={() => setShow(false)}
        callback={callback} />
    </Box>
  );
}
