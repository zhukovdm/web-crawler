import {
  ChangeEvent,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector
} from "../../store";
import { Network } from "vis-network";

type ModeType = "static" | "live";

type ViewType = "domain" | "website";

export default function Visualisation(): JSX.Element {

  const dispatch = useAppDispatch();
  const { selection } = useAppSelector((state) => state.vis);

  const [tick, setTick] = useState(3);
  const [mode, setMode] = useState<ModeType>("static");
  const [view, setView] = useState<ViewType>("website");

  const vis = useRef<HTMLInputElement>(null);

  useEffect(() => {

    const nodes = [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
      { id: 5, label: "Node 5" },
    ];

    const edges = [
      { from: 1, to: 3, arrows: "to" },
      { from: 1, to: 2, arrows: "to" },
      { from: 2, to: 1, arrows: "to" },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 },
    ];

    const options = {
      nodes: {
        size: 10,
        shape: "dot"
      }
    };

    const network = vis.current && new Network(vis.current, { nodes, edges }, options);
    network?.on("doubleClick", (e) => console.log(e));
  }, [vis, mode]);

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
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setView(e.target.value as ViewType);
            }}
          >
            <FormControlLabel
              value={"website"}
              label={"Website"}
              control={<Radio />}
            />
            <FormControlLabel
              value={"domain"}
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setMode(e.target.value as ModeType);
            }}
          >
            <FormControlLabel
              value={"static"}
              label={"Static"}
              control={<Radio />}
            />
            <FormControlLabel
              value={"live"}
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
      <Paper
        ref={vis}
        sx={{ width: "100%", height: "500px" }}
      />
    </Stack>
  );
}
