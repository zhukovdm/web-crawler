import { createSlice } from "@reduxjs/toolkit";
import {
  RecordFilters,
  RecordSorters
} from "../domain/types";

type RecInitialStateType = {
  filters: RecordFilters;
  sorters: RecordSorters;
};

const initialState = (): RecInitialStateType => ({
  filters: { tags: [] },
  sorters: { url: false, lastCrawlTime: false }
});

export const recSlice = createSlice({
  name: "rec",
  initialState: (initialState()),
  reducers: {
  }
});

export const {
} = recSlice.actions;

export default recSlice.reducer;
