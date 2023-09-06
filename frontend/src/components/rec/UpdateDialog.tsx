import { useState } from "react";
import {
  Box,
  IconButton
} from "@mui/material";
import { Update } from "@mui/icons-material";
import { RecordBaseType } from "../../domain/types";
import { useAppDispatch, useAppSelector } from "../../store";
import { setUpdateAction, updateRecord } from "../../store/recSlice";
import { OpenApiService } from "../../services/openapi";
import RecordDialog from "../_shared/RecordDialog";

type UpdateDialogType = {
  index: number;
};

export default function UpdateDialog({ index }: UpdateDialogType): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    records,
    updateAction
  } = useAppSelector((state) => state.rec);

  const record = records[index]!;

  const [show, setShow] = useState(false);

  const callback = async (updatedRecord: RecordBaseType) => {
    dispatch(setUpdateAction(true));
    try {
      await OpenApiService.updateRecord(record.recId, updatedRecord);
      dispatch(updateRecord({
        index: index,
        record: { ...record, ...updatedRecord }
      }));
      setShow(false);
    }
    catch (ex: unknown) { alert(ex); }
    finally {
      dispatch(setUpdateAction(false));
    }
  };

  return (
    <Box>
      <IconButton
        size={"small"}
        title={"Update record"}
        onClick={() => setShow(true)}
      >
        <Update fontSize={"small"} />
      </IconButton>
      <RecordDialog
        show={show}
        action={"update"}
        remoteAction={updateAction}
        hide={() => setShow(false)}
        callback={callback}
        record={record}
      />
    </Box>
  );
}
