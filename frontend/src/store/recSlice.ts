import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";
import {
  RecordFilters,
  RecordFullType,
  RecordSorters
} from "../domain/types";

type RecInitialStateType = {
  loading: boolean;
  filters: RecordFilters;
  sorters: RecordSorters;
  records: RecordFullType[];
};

const initialState = (): RecInitialStateType => ({
  loading: false,
  filters: { tags: [] },
  sorters: { url: false, lastCrawlTime: false },
  records: []
});

export const recSlice = createSlice({
  name: "rec",
  initialState: (initialState()),
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    appendRecord: (state, action: PayloadAction<RecordFullType>) => {
      state.records.push(action.payload);
    }
  }
});

export const {
  setLoading,
  appendRecord
} = recSlice.actions;

export default recSlice.reducer;
