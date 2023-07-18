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
  filters: RecordFilters;
  sorters: RecordSorters;
  records: RecordFullType[];
  createAction: boolean;
  updateAction: boolean;
  getAllAction: boolean;
};

const initialState = (): RecInitialStateType => ({
  filters: { tags: [] },
  sorters: { url: false, lastCrawlTime: false },
  records: [],
  getAllAction: true,
  createAction: false,
  updateAction: false,
});

export const recSlice = createSlice({
  name: "rec",
  initialState: (initialState()),
  reducers: {
    setRecords: (state, action: PayloadAction<RecordFullType[]>) => {
      state.records = action.payload;
    },
    appendRecord: (state, action: PayloadAction<RecordFullType>) => {
      state.records.push(action.payload);
    },
    setGetAllAction: (state, action: PayloadAction<boolean>) => {
      state.getAllAction = action.payload;
    },
    setCreateAction: (state, action: PayloadAction<boolean>) => {
      state.createAction = action.payload;
    },
    setUpdateAction: (state, action: PayloadAction<boolean>) => {
      state.updateAction = action.payload;
    },
  }
});

export const {
  setRecords,
  appendRecord,
  setGetAllAction,
  setCreateAction,
  setUpdateAction,
} = recSlice.actions;

export default recSlice.reducer;
