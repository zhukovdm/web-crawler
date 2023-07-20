import { ChangeEvent, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField
} from "@mui/material";
import { useAppSelector } from "../../store";

export default function Visualisation(): JSX.Element {

  const { selection } = useAppSelector((state) => state.vis);

  const [view, setView] = useState("0");
  const [mode, setMode] = useState("0");
  const [tick, setTick] = useState(3);

  return (
    <Stack direction={"column"} gap={2}>
      <Stack
        gap={8}
        direction={"row"}
        justifyContent={"center"}
      >
        <FormControl>
          <FormLabel>View</FormLabel>
          <RadioGroup
            row
            value={view}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setView(e.target.value)}
          >
            <FormControlLabel
              value={"0"}
              label={"Website"}
              control={<Radio />}
            />
            <FormControlLabel
              value={"1"}
              label={"Domain"}
              control={<Radio />}
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Mode</FormLabel>
          <RadioGroup
            row
            value={mode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMode(e.target.value)}
          >
            <FormControlLabel
              value={"0"}
              label={"Static"}
              control={<Radio />}
            />
            <FormControlLabel
              value={"1"}
              label={"Live"}
              control={<Radio />}
            />
          </RadioGroup>
        </FormControl>
        <Box display={"flex"} alignItems={"center"}>
          <TextField
            size={"small"}
            type={"number"}
            value={tick.toString()}
            label={"Interval"}
            sx={{ width: "8rem" }}
            onChange={(e) => setTick(Math.max(3, parseInt(e.target.value)))}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
