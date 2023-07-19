import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  Box,
  Chip,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { RecordFullType } from "../../domain/types";
import {
  minutesToDdhhmm,
  stringToTags
} from "../../domain/functions";
import { useAppSelector } from "../../store";
import UpdateDialog from "./UpdateDialog";
import DeleteDialog from "./DeleteDialog";
import ExecutDialog from "./ExecutDialog";

const PAGE_SIZE = 5;

function totalPages(length: number): number {
  const whole = Math.floor(length / PAGE_SIZE);
  return Math.max(1, whole + ((whole * PAGE_SIZE < length) ? 1 : 0));
}

function showPeriod(period: number): string {
  const dhm = minutesToDdhhmm(period);

  return ["days", "hours", "minutes"]
    .map((sfx, idx) => (
      (dhm[idx] === 0) ? undefined : `${dhm[idx]} ${sfx}`
    ))
    .filter((itm) => itm !== undefined)
    .join(", ");
}

export default function RecordsTable(): JSX.Element {

  const {
    records,
    labFilterAct,
    labFilterCon,
    urlFilterAct,
    urlFilterCon,
    tagFilterAct,
    tagFilterCon
  } = useAppSelector((state) => state.rec);

  const fsRecords = useMemo(() => {

    return records
      .map((r, i) => [r, i] as [RecordFullType, number])
      .filter(([r, _]) => !labFilterAct || r.label.toLowerCase().includes(labFilterCon))
      .filter(([r, _]) => !urlFilterAct || r.label.toLowerCase().includes(urlFilterCon))
      .filter(([r, _]) => {
        const rt = new Set(stringToTags(tagFilterCon))
        return !tagFilterAct || r.tags.reduce((acc, t) => acc || rt.has(t), false);
      });
  }, [
    records,
    labFilterAct,
    labFilterCon,
    urlFilterAct,
    urlFilterCon,
    tagFilterAct,
    tagFilterCon
  ]);

  const [curPage, setCurPage] = useState(1);
  const [curRecs, setCurRecs] = useState(fsRecords.slice(0, PAGE_SIZE));

  useEffect(() => {
    const base = (curPage - 1) * PAGE_SIZE
    setCurRecs(fsRecords.slice(base, base + PAGE_SIZE))
  }, [curPage, fsRecords]);

  const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurPage(value);
  };

  return (
    <Stack direction={"column"} gap={4}>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          size={"large"}
          count={totalPages(fsRecords.length)}
          shape={"rounded"}
          variant={"outlined"}
          page={curPage}
          onChange={handlePage}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label={"table of records"}>
          {/* <colgroup>
            <col width={"100%"} />
          </colgroup> */}
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Periodicity</TableCell>
              <TableCell>Last exec. stat</TableCell>
              <TableCell>Last exec. time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {curRecs.map(([r, i]) => (
              <TableRow key={r.recId}>
                <TableCell>
                  {r.label}
                </TableCell>
                <TableCell>
                  {r.url}
                </TableCell>
                <TableCell>
                  <Stack direction={"row"} gap={0.5} flexWrap={"wrap"}>
                    {r.tags.map((t, i) => (
                      <Chip key={i} label={t} size={"small"} />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  {showPeriod(r.period)}
                </TableCell>
                <TableCell>
                  {r.lastExecFinishTime ?? r.lastExecCreateTime ?? "N/A"}
                </TableCell>
                <TableCell>
                  {r.lastExecStatus ?? "N/A"}
                </TableCell>
                <TableCell>
                  <Stack direction={"row"}>
                    <ExecutDialog index={i} />
                    <UpdateDialog index={i} />
                    <DeleteDialog index={i} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
