import React from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Radio,
  Stack,
  Typography
} from "@mui/material";
import {
  ArrowCircleDown,
  ArrowCircleUp
} from "@mui/icons-material";
import {
  useAppDispatch,
  useAppSelector
} from "../../store";
import {
  setSorterAct,
  setSorterCon,
  setUrlSorterAsc,
  setTimSorterAsc
} from "../../store/recSlice";

function getOrder(ad: boolean): string {
  return `${ad ? "a" : "de"}scending order`;
}

export default function SorterConfig(): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    sorterAct,
    sorterCon,
    urlSorterAsc,
    timSorterAsc
  } = useAppSelector((state) => state.rec);

  const handleRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSorterCon(parseInt(event.target.value)));
  };

  return (
    <Stack direction={"column"} gap={2}>
      <Typography fontSize={"large"}>Sorters</Typography>
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <Box>
          <Checkbox
            value={sorterAct}
            onChange={(_, v) => dispatch(setSorterAct(v))}
          />
        </Box>
        <Stack gap={1}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <IconButton
              size={"small"}
              title={getOrder(urlSorterAsc)}
              onClick={() => dispatch(setUrlSorterAsc(!urlSorterAsc))}
            >
              {urlSorterAsc ? <ArrowCircleDown /> : <ArrowCircleUp />}
            </IconButton>
            <Radio
              value={0}
              checked={sorterCon === 0}
              onChange={handleRadio}
            />
            <Typography>by URL</Typography>
          </Stack>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <IconButton
              size={"small"}
              title={getOrder(timSorterAsc)}
              onClick={() => dispatch(setTimSorterAsc(!timSorterAsc))}
            >
              {timSorterAsc ? <ArrowCircleDown /> : <ArrowCircleUp />}
            </IconButton>
            <Radio
              value={1}
              checked={sorterCon === 1}
              onChange={handleRadio}
            />
            <Typography>by crawl time</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
