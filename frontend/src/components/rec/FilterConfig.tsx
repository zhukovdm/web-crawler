import {
  Checkbox,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector
} from "../../store";
import {
  setLabFilterAct,
  setLabFilterCon,
  setTagFilterAct,
  setTagFilterCon,
  setUrlFilterAct,
  setUrlFilterCon
} from "../../store/recSlice";
import React from "react";

export default function FilterConfig(): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    urlFilterAct,
    urlFilterCon,
    labFilterAct,
    labFilterCon,
    tagFilterAct,
    tagFilterCon
  } = useAppSelector((state) => state.rec);

  return (
    <Stack direction={"column"} gap={2}>
      <Typography fontSize={"large"}>Filters</Typography>
      <Stack direction={"row"} gap={4}>
        <Stack direction={"row"} gap={1}>
          <Checkbox
            value={urlFilterAct}
            onChange={(_, v) => dispatch(setUrlFilterAct(v))}
          />
          <TextField
            size={"small"}
            label={"URL (exact)"}
            value={urlFilterCon}
            disabled={!urlFilterAct}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(setUrlFilterCon(e.target.value));
            }}
          />
        </Stack>
        <Stack direction={"row"} gap={1}>
          <Checkbox
            value={labFilterAct}
            onChange={(_, v) => dispatch(setLabFilterAct(v))}
          />
          <TextField
            size={"small"}
            label={"Label (substr)"}
            value={labFilterCon}
            disabled={!labFilterAct}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(setLabFilterCon(e.target.value));
            }}
          />
        </Stack>
        <Stack direction={"row"} gap={1}>
          <Checkbox
            value={tagFilterAct}
            onChange={(_, v) => dispatch(setTagFilterAct(v))}
          />
          <TextField
            size={"small"}
            label={"Tags (any of)"}
            value={tagFilterCon}
            disabled={!tagFilterAct}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(setTagFilterCon(e.target.value));
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
