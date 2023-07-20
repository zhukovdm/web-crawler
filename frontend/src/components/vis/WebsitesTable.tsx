import { useState } from "react";
import {
  Box,
  Checkbox,
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
import { getPageCount } from "../_shared/paginate";
import { useAppDispatch, useAppSelector } from "../../store";
import { setSelection } from "../../store/visSlice";

export default function WebsitesTable(): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    websites,
    selection
  } = useAppSelector((state) => state.vis);

  const [curPage, setCurPage] = useState(1);

  const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurPage(value);
  };

  return (
    <Stack direction={"column"} gap={4}>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={curPage}
          count={getPageCount(websites.length)}
          onChange={handlePage}
          size={"large"}
          shape={"rounded"}
          variant={"outlined"}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table
          size={"small"}
          sx={{ width: "100%" }}
          aria-label={"table of websites"}
        >
          <TableHead>
            <TableRow>
              <TableCell>Selection</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {websites.map((site, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Checkbox
                    size={"small"}
                    checked={selection[i]}
                    onChange={() => dispatch(setSelection({ value: !selection[i], index: i }))}
                  />
                </TableCell>
                <TableCell>{site.label}</TableCell>
                <TableCell>{site.url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
