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
import { Send, Settings } from "@mui/icons-material";
import { OpenApiService } from "../../services/openapi";
import {
  useAppDispatch,
  useAppSelector
} from "../../store";
import { setExecutAction } from "../../store/recSlice";

type ExecutDialogType = {
  index: number;
}

export default function ExecutDialog({ index }: ExecutDialogType): JSX.Element {

  const dispatch = useAppDispatch();
  const { records, executAction } = useAppSelector((state) => state.rec);

  const record = records[index]!;
  const [show, setShow] = useState(false);

  const confirm = async () => {
    dispatch(setExecutAction(true));
    try {
      await OpenApiService.createExecution(record.recId);
      setShow(false);
    }
    catch (ex: unknown) { alert(ex); }
    finally {
      dispatch(setExecutAction(false));
    }
  };

  return (
    <Box>
      <IconButton
        size={"small"}
        title={"Execute record"}
        onClick={() => setShow(true)}
      >
        <Settings fontSize={"small"} />
      </IconButton>
      <Dialog open={show}>
        <DialogTitle>Execute record</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to create execution for<br />
            the record with ID: <strong>{`${record?.recId}`}</strong>. Confirm the action.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color={"error"}
            disabled={executAction}
            onClick={() => setShow(false)}
          >
            <span>Cancel</span>
          </Button>
          <LoadingButton
            loading={executAction}
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
