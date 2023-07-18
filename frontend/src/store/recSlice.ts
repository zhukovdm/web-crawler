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
  getAllAction: boolean;
  createAction: boolean;
  executAction: boolean;
  updateAction: boolean;
  deleteAction: boolean;
};

const initialState = (): RecInitialStateType => ({
  filters: { tags: [] },
  sorters: { url: false, lastCrawlTime: false },
  records: [],
  getAllAction: true,
  createAction: false,
  executAction: false,
  updateAction: false,
  deleteAction: false
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
    updateRecord: (state, action: PayloadAction<{ index: number, record: RecordFullType }>) => {
      const { index, record } = action.payload;
      state.records = [...state.records.slice(0, index), record, ...state.records.slice(index + 1)];
    },
    deleteRecord: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.records = [...state.records.slice(0, index), ...state.records.slice(index + 1)];
    },
    setGetAllAction: (state, action: PayloadAction<boolean>) => {
      state.getAllAction = action.payload;
    },
    setCreateAction: (state, action: PayloadAction<boolean>) => {
      state.createAction = action.payload;
    },
    setExecutAction: (state, action: PayloadAction<boolean>) => {
      state.executAction = action.payload;
    },
    setUpdateAction: (state, action: PayloadAction<boolean>) => {
      state.updateAction = action.payload;
    },
    setDeleteAction: (state, action: PayloadAction<boolean>) => {
      state.deleteAction = action.payload;
    }
  }
});

export const {
  setRecords,
  appendRecord,
  updateRecord,
  deleteRecord,
  setGetAllAction,
  setCreateAction,
  setExecutAction,
  setUpdateAction,
  setDeleteAction
} = recSlice.actions;

export default recSlice.reducer;
