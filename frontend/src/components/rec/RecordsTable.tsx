import {
  Box,
  Chip,
  IconButton,
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
import {
  Delete,
  Settings,
  Update
} from "@mui/icons-material";
import { RecordFullType } from "../../domain/types";
import { minutesToDdhhmm } from "../../domain/functions";
import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

function totalPages(length: number): number {
  const whole = Math.floor(length / PAGE_SIZE); console.log(whole);
  return Math.max(1, whole + ((whole * PAGE_SIZE < length) ? 1 : 0));
}

function showPeriod(period: number): string {
  const { dd, hh, mm } = minutesToDdhhmm(period);
  return `${dd}-${hh}-${mm}`;
}

type RecordsTableType = {
  records: RecordFullType[];
};

export default function RecordsTable({ records }: RecordsTableType): JSX.Element {

  const [curPage, setCurPage] = useState(1);
  const [curRecs, setCurRecs] = useState(records.slice(0, PAGE_SIZE));

  useEffect(() => {
    const base = (curPage - 1) * PAGE_SIZE
    setCurRecs(records.slice(base, base + PAGE_SIZE))
  }, [curPage, records]);

  const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurPage(value);
  }

  return (
    <Stack direction={"column"} gap={4}>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label={"Record table"}>
          {/* <colgroup>
            <col width={"17%"} />
            <col width={"23%"} />
            <col width={"15%"} />
            <col width={"15%"} />
            <col width={"15%"} />
            <col width={"15%"} />
          </colgroup> */}
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Period (dd-hh-mm)</TableCell>
              <TableCell>Last exec. stat</TableCell>
              <TableCell>Last exec. time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {curRecs.map((rec) => (
              <TableRow key={rec.recId}>
                <TableCell>
                  {rec.label}
                </TableCell>
                <TableCell>
                  {rec.url}
                </TableCell>
                <TableCell>
                  <Stack direction={"row"} gap={0.5} flexWrap={"wrap"}>
                    {rec.tags.map((tag, i) => (
                      <Chip key={i} label={tag} size={"small"} />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  {showPeriod(rec.period)}
                </TableCell>
                <TableCell>
                  {rec.lastExecFinishTime ?? rec.lastExecCreateTime ?? "N/A"}
                </TableCell>
                <TableCell>
                  {rec.lastExecStatus ?? "N/A"}
                </TableCell>
                <TableCell>
                  <Stack direction={"row"}>
                    <IconButton title={"Delete record"} size={"small"}>
                      <Delete fontSize={"small"} />
                    </IconButton>
                    <IconButton title={"Update record"} size={"small"}>
                      <Update fontSize={"small"} />
                    </IconButton>
                    <IconButton title={"Execute record"} size={"small"}>
                      <Settings fontSize={"small"} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          count={totalPages(records.length)}
          size={"large"}
          shape={"rounded"}
          variant={"outlined"}
          page={curPage}
          onChange={handlePage}
        />
      </Box>
    </Stack>
  );
}