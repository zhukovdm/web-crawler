import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete, Send } from "@mui/icons-material";
import {
  useAppDispatch,
  useAppSelector
} from "../../store";
import {
  deleteRecord,
  setDeleteAction
} from "../../store/recSlice";
import { OpenApiService } from "../../services/openapi";

type DeleteDialogType = {
  index: number;
};

export default function DeleteDialog({ index }: DeleteDialogType): JSX.Element {

  const dispatch = useAppDispatch();
  const { records, deleteAction } = useAppSelector((state) => state.rec);

  const record = records[index];
  const [show, setShow] = useState(false);

  const confirm = async () => {
    dispatch(setDeleteAction(true));
    try {
      await OpenApiService.deleteRecord(record!.recId);
      setShow(false);
      dispatch(deleteRecord(index));
    }
    catch (ex: any) { alert(ex?.message); }
    finally {
      dispatch(setDeleteAction(false));
    }
  };

  return (
    <Box>
      <IconButton
        size={"small"}
        title={"Delete record"}
        onClick={() => setShow(true)}
      >
        <Delete fontSize={"small"} />
      </IconButton>
      <Dialog open={show}>
        <DialogTitle>Delete record</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to delete<br />
            the record with ID: {`${record?.recId}`}. Confirm the action.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color={"error"}
            disabled={deleteAction}
            onClick={() => setShow(false)}
          >
            <span>Cancel</span>
          </Button>
          <LoadingButton
            loading={deleteAction}
            loadingPosition={"start"}
            startIcon={<Send />}
            onClick={confirm}
          >
            <span>Confirm</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
