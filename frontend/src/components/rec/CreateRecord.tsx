import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";

export default function CreateRecord(): JSX.Element {
  const [dialog, showDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Box>
      <Button variant={"outlined"} onClick={() => showDialog(true)}>Create record</Button>
      <Dialog open={dialog}>
        <DialogTitle>Create record</DialogTitle>
        <DialogActions>
          <Button
            color={"error"}
            disabled={loading}
            onClick={() => showDialog(false)}
          >
            <span>Cancel</span>
          </Button>
          <LoadingButton
            loading
            loadingPosition={"start"}
            startIcon={<Send />}
          >
            <span>Confirm</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
