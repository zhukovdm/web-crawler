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
};

const initialState = (): RecInitialStateType => ({
  filters: { tags: [] },
  sorters: { url: false, lastCrawlTime: false },
  records: [],
  createAction: false,
  updateAction: false
});

export const recSlice = createSlice({
  name: "rec",
  initialState: (initialState()),
  reducers: {
    appendRecord: (state, action: PayloadAction<RecordFullType>) => {
      state.records.push(action.payload);
    },
    setCreateAction: (state, action: PayloadAction<boolean>) => {
      state.createAction = action.payload;
    },
    setUpdateAction: (state, action: PayloadAction<boolean>) => {
      state.updateAction = action.payload;
    }
  }
});

export const {
  appendRecord,
  setCreateAction,
  setUpdateAction
} = recSlice.actions;

export default recSlice.reducer;
