import { useEffect, useMemo, useState } from "react";
import {
  Box,
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
import { useAppSelector } from "../../store";
import { ExecutionFullType } from "../../domain/types";
import {
  getFirstPage,
  getPageCount,
  updatePage
} from "../_shared/paginate";

type ExecutionsTableType = {
  exes: ExecutionFullType[];
};

export default function ExecutionsTable({ exes }: ExecutionsTableType): JSX.Element {

  const {
    exeFilterAct,
    exeFilterCon
  } = useAppSelector((state) => state.exe);

  const fsExecutions = useMemo(() => {
    return exes
      .map((e, i) => [e, i] as [ExecutionFullType, number])
      .filter(([e, _]) => !exeFilterAct || e.recId === exeFilterCon);
  }, [exes, exeFilterAct, exeFilterCon]);

  const [curPage, setCurPage] = useState(1);
  const [curExes, setCurExes] = useState(getFirstPage(fsExecutions));

  useEffect(() => {
    const [nxtPage, nxtExes] = updatePage(curPage, fsExecutions);
    setCurPage(nxtPage);
    setCurExes(nxtExes);
  }, [curPage, fsExecutions]);

  const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurPage(value);
  };

  return (
    <Stack direction={"column"} gap={4}>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={curPage}
          count={getPageCount(fsExecutions.length)}
          onChange={handlePage}
          size={"large"}
          shape={"rounded"}
          variant={"outlined"}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label={"table of executions"}>
          {/* <colgroup>
            <col width={"100%"} />
          </colgroup> */}
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Create time</TableCell>
              <TableCell>Finish time</TableCell>
              <TableCell>Sites crawled</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {curExes.map(([e]) => (
              <TableRow key={e.exeId}>
                <TableCell>{e.label}</TableCell>
                <TableCell>{e.status}</TableCell>
                <TableCell>{e.createTime}</TableCell>
                <TableCell>{e.finishTime}</TableCell>
                <TableCell>{e.nodCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
