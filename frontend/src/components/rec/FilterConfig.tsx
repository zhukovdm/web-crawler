import {
  Checkbox,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store";
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
    urlFilterCon,
    urlFilterAct,
    labFilterCon,
    labFilterAct,
    tagFilterCon,
    tagFilterAct
  } = useAppSelector((state) => state.rec);

  return (
    <Stack direction={"column"} gap={2}>
      <Typography fontSize={"large"}>Filters</Typography>
      <Stack direction={"column"} gap={4}>
        <Stack direction={"row"} gap={1}>
          <Checkbox
            checked={labFilterAct}
            onChange={(_, v) => dispatch(setLabFilterAct(v))}
          />
          <TextField
            size={"small"}
            label={"Label"}
            placeholder={"Label (substr)"}
            value={labFilterCon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(setLabFilterCon(e.target.value));
            }}
          />
        </Stack>
        <Stack direction={"row"} gap={1}>
          <Checkbox
            checked={urlFilterAct}
            onChange={(_, v) => dispatch(setUrlFilterAct(v))}
          />
          <TextField
            size={"small"}
            label={"URL"}
            placeholder={"URL (substr)"}
            value={urlFilterCon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(setUrlFilterCon(e.target.value));
            }}
          />
        </Stack>
        <Stack direction={"row"} gap={1}>
          <Checkbox
            checked={tagFilterAct}
            onChange={(_, v) => dispatch(setTagFilterAct(v))}
          />
          <TextField
            size={"small"}
            label={"Tags"}
            placeholder={"Tags (any of)"}
            value={tagFilterCon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(setTagFilterCon(e.target.value));
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
