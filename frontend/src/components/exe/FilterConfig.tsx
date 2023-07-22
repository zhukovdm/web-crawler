import { useMemo } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import { ExecutionType } from "../../domain/types";
import {
  useAppDispatch,
  useAppSelector
} from "../../store";
import { setExeFilterAct, setExeFilterCon } from "../../store/exeSlice";

type FilterConfigType = {
  load: boolean;
  exes: ExecutionType[];
}

export default function FilterConfig({ load, exes }: FilterConfigType): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    exeFilterAct,
    exeFilterCon
  } = useAppSelector((state) => state.exe);

  const recs = useMemo(() => ([
    ...exes
      .map((exe) => [exe.recId, exe.label] as [number, string])
      .reduce((acc, [recId, label]) => acc.set(recId, label), new Map<number, string>())
      .entries()
  ]), [exes]);

  return (
    <Stack direction={"column"} gap={2}>
      <Typography fontSize={"large"}>Filters</Typography>
      <Stack direction={"row"} gap={1}>
        <Box display={"flex"} alignItems={"center"}>
          <Checkbox
            checked={exeFilterAct}
            disabled={load}
            onChange={(_, v) => dispatch(setExeFilterAct(v))}
          />
        </Box>
        <FormControl
          size={"small"}
          sx={{ width: "200px" }}
        >
          <InputLabel id="execution-filter-label">Record</InputLabel>
          <Select
            disabled={load}
            label={"Record"}
            labelId={"execution-filter-label"}
            value={exeFilterCon !== undefined ? exeFilterCon.toString(): ""}
            onChange={(e) => {
              dispatch(setExeFilterCon((e.target.value !== "") ? parseInt(e.target.value) : undefined));
            }}
          >
            <MenuItem value={""}>None</MenuItem>
            {recs.map(([recId, label]) => (
              <MenuItem key={recId} value={recId.toString()}>
                <strong>{recId}:</strong>&nbsp;{label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
