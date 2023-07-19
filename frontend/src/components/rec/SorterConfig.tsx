import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector
} from "../../store";
import {
  setSorterAct,
  setSorterCon
} from "../../store/recSlice";

export default function SorterConfig(): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    sorterAct,
    sorterCon
  } = useAppSelector((state) => state.rec);

  return (
    <Stack direction={"column"} gap={2}>
      <Typography fontSize={"large"}>Sorters</Typography>
      <Stack direction={"row"} gap={2} alignItems={"center"}>
        <Box>
          <Checkbox
            value={sorterAct}
            onChange={(_, v) => dispatch(setSorterAct(v))}
          />
        </Box>
        <RadioGroup
          row={false}
          value={sorterCon}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setSorterCon(parseInt(e.target.value)))
          }}
        >
          <FormControlLabel
            value={0}
            label={"by URL"}
            disabled={!sorterAct}
            control={<Radio />}
          />
          <FormControlLabel
            value={1}
            label={"by crawl time"}
            disabled={!sorterAct}
            control={<Radio />}
          />
        </RadioGroup>
      </Stack>
    </Stack>
  );
}
