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
import {
  getFirstPage,
  getPageCount,
  updatePage
} from "../_shared/paginate";
import UpdateDialog from "./UpdateDialog";
import DeleteDialog from "./DeleteDialog";
import ExecutDialog from "./ExecutDialog";

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
    tagFilterCon,
    sorterAct,
    sorterCon,
    urlSorterAsc,
    timSorterAsc
  } = useAppSelector((state) => state.rec);

  const fsRecords = useMemo(() => {

    let rs = records
      .map((r, i) => [r, i] as [RecordFullType, number])
      .filter(([r, _]) => !labFilterAct || r.label.toLowerCase().includes(labFilterCon))
      .filter(([r, _]) => !urlFilterAct || r.label.toLowerCase().includes(urlFilterCon))
      .filter(([r, _]) => {
        const rt = new Set(stringToTags(tagFilterCon))
        return !tagFilterAct || r.tags.reduce((acc, t) => acc || rt.has(t), false);
      });

    if (sorterAct && sorterCon === 0 /* url */) {
      const factor = urlSorterAsc ? +1 : -1;
      rs = rs.sort(([{ url: l }], [{ url: r }]) => {
        if (l < r) { return -1 * factor; }
        if (l > r) { return +1 * factor; }
        return 0;
      });
    }

    if (sorterAct && sorterCon === 1 /* tim */) {
      const factor = timSorterAsc ? +1 : -1;
      rs = rs.sort(([{ lastExecFinishTime: l }], [{ lastExecFinishTime: r }]) => {

        if (l !== null && r === null) { return -1 * factor; }
        if (l === null && r !== null) { return +1 * factor; }
        if (l !== null && r !== null) {
          const ld = new Date(l);
          const rd = new Date(r);
          if (ld < rd) { return -1 * factor; }
          if (ld > rd) { return +1 * factor; }
        }

        return 0;
      })
    }

    return rs;
  }, [
    records,
    labFilterAct,
    labFilterCon,
    urlFilterAct,
    urlFilterCon,
    tagFilterAct,
    tagFilterCon,
    sorterAct,
    sorterCon,
    urlSorterAsc,
    timSorterAsc
  ]);

  const [curPage, setCurPage] = useState(1);
  const [curRecs, setCurRecs] = useState(getFirstPage(fsRecords));

  useEffect(() => {
    const [nxtPage, nxtRecs] = updatePage(curPage, fsRecords);
    setCurPage(nxtPage);
    setCurRecs(nxtRecs);
  }, [curPage, fsRecords]);

  const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurPage(value);
  };

  return (
    <Stack direction={"column"} gap={4}>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={curPage}
          count={getPageCount(fsRecords.length)}
          onChange={handlePage}
          size={"large"}
          shape={"rounded"}
          variant={"outlined"}
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
                <TableCell>{r.label}</TableCell>
                <TableCell>{r.url}</TableCell>
                <TableCell>
                  <Stack direction={"row"} gap={0.5} flexWrap={"wrap"}>
                    {r.tags.map((t, i) => (
                      <Chip key={i} label={t} size={"small"} />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>{showPeriod(r.period)}</TableCell>
                <TableCell>{r.lastExecStatus ?? "N/A"}</TableCell>
                <TableCell>{r.lastExecFinishTime ?? "N/A"}</TableCell>
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
