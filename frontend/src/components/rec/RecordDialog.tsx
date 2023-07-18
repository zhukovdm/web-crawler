import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete, Send } from "@mui/icons-material";
import { RecordBaseType } from "../../domain/types";
import {
  ddhhmmToMinutes,
  minutesToDdhhmm
} from "../../domain/functions";

type RecordDialogType = {
  show: boolean
  hide: () => void;
  record?: RecordBaseType;
  action: "create" | "update";
  remoteAction: boolean;
  callback: (record: RecordBaseType) => void;
};

function isValidLab(label: string): boolean {
  return label.trim().length > 0;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url); return true;
  }
  catch (_) { return false; }
}

function isValidRgx(regexp: string): boolean {
  try {
    new RegExp(regexp, "i");
    return regexp.length > 0;
  }
  catch (_) { return false; }
}

function isValidDhm(dd: number, hh: number, mm: number): boolean {
  return dd > 0 || hh > 0 || mm > 0;
}

export default function RecordDialog(
  { show, hide, record, action, remoteAction, callback }: RecordDialogType): JSX.Element {

  const [dd, hh, mm] = (record)
    ? minutesToDdhhmm(record.period) : [0, 0, 0];

  const [lab, setLab] = useState(record?.label ?? "");
  const [labError, setLabError] = useState(false);

  const [url, setUrl] = useState(record?.url ?? "");
  const [urlError, setUrlError] = useState(false);

  const [rgx, setRgx] = useState(record?.regexp ?? "");
  const [rgxError, setRgxError] = useState(false);

  const [act, setAct] = useState(record?.active ?? true);
  const [tag, setTag] = useState(record?.tags ? record.tags.join(", ") : "");

  const [periodDD, setPeriodDD] = useState(dd);
  const [periodHH, setPeriodHH] = useState(hh);
  const [periodMM, setPeriodMM] = useState(mm);
  const [dhmError, setDhmError] = useState(false);

  const clean = () => {

    setLab("");
    setUrl("");
    setRgx("");
    setTag("");
    setAct(true);
    setPeriodDD(0);
    setPeriodHH(0);
    setPeriodMM(0);
  };

  const confirm = () => {

    const l = !isValidLab(lab);
    const u = !isValidUrl(url);
    const r = !isValidRgx(rgx);
    const d = !isValidDhm(periodDD, periodHH, periodMM);

    setLabError(l);
    setUrlError(u);
    setRgxError(r);
    setDhmError(d);

    if (!l && !u && !r && !d) {
      callback({
        url: url.trim(),
        regexp: rgx.trim(),
        period: ddhhmmToMinutes([periodDD, periodHH, periodMM]),
        label: lab.trim(),
        active: act,
        tags: tag.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      });
    }
  };

  return (
    <Dialog open={show}>
      <DialogTitle
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {action.slice(0, 1).toUpperCase() + action.slice(1)} record
        <IconButton
          title="Clean dialog"
          disabled={remoteAction}
          onClick={clean}
        >
          <Delete />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ my: 1 }} direction={"column"} gap={3}>
          <TextField
            required
            disabled={remoteAction}
            value={lab}
            label={"Label"}
            error={labError}
            onChange={(e) => setLab(e.target.value)}
            size={"small"}
          />
          <TextField
            required
            disabled={remoteAction}
            value={url}
            label={"URL"}
            error={urlError}
            onChange={(e) => setUrl(e.target.value)}
            size={"small"}
          />
          <TextField
            required
            disabled={remoteAction}
            value={rgx}
            label={"RegExp"}
            error={rgxError}
            onChange={(e) => setRgx(e.target.value)}
            size={"small"}
            helperText={"Any JavaScript-valid expression"}
          />
          <Stack direction={"row"} gap={1}>
            <TextField
              sx={{ width: "6rem" }}
              required
              disabled={remoteAction}
              type={"number"}
              value={periodDD}
              label={"Days"}
              error={dhmError}
              onChange={(e) => setPeriodDD(Math.max(0, parseInt(e.target.value)))}
              size={"small"}
            />
            <TextField
              sx={{ width: "6rem" }}
              required
              disabled={remoteAction}
              type={"number"}
              value={periodHH}
              label={"Hours"}
              error={dhmError}
              onChange={(e) => setPeriodHH(Math.max(0, parseInt(e.target.value)))}
              size={"small"}
            />
            <TextField
              sx={{ width: "6rem" }}
              required
              disabled={remoteAction}
              type={"number"}
              value={periodMM}
              label={"Minutes"}
              error={dhmError}
              onChange={(e) => setPeriodMM(Math.max(0, parseInt(e.target.value)))}
              size={"small"}
            />
          </Stack>
          <TextField
            disabled={remoteAction}
            value={tag}
            label={"Tags"}
            onChange={(e) => setTag(e.target.value)}
            size={"small"}
            helperText={"Comma-separated words"}
          />
          <Stack
            direction={"row"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
          >
            <Typography>Active</Typography>
            <Switch checked={act} onChange={(e) => setAct(e.target.checked)} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color={"error"}
          disabled={remoteAction}
          onClick={hide}
        >
          <span>Cancel</span>
        </Button>
        <LoadingButton
          loading={remoteAction}
          loadingPosition={"start"}
          startIcon={<Send />}
          onClick={confirm}
        >
          <span>Confirm</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
