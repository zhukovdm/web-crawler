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
  urlFilterCon: string;
  urlFilterAct: boolean;
  labFilterCon: string;
  labFilterAct: boolean;
  tagFilterCon: string;
  tagFilterAct: boolean;
  sorterCon: number;
  sorterAct: boolean;
};

const initialState = (): RecInitialStateType => ({
  filters: { tags: [] },
  sorters: { url: false, lastCrawlTime: false },
  records: [],
  getAllAction: true,
  createAction: false,
  executAction: false,
  updateAction: false,
  deleteAction: false,
  urlFilterCon: "",
  urlFilterAct: false,
  labFilterCon: "",
  labFilterAct: false,
  tagFilterCon: "",
  tagFilterAct: false,
  sorterCon: 0,
  sorterAct: false
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
    },
    setUrlFilterCon: (state, action: PayloadAction<string>) => {
      state.urlFilterCon = action.payload;
    },
    setUrlFilterAct: (state, action: PayloadAction<boolean>) => {
      state.urlFilterAct = action.payload;
    },
    setLabFilterCon: (state, action: PayloadAction<string>) => {
      state.labFilterCon = action.payload;
    },
    setLabFilterAct: (state, action: PayloadAction<boolean>) => {
      state.labFilterAct = action.payload;
    },
    setTagFilterCon: (state, action: PayloadAction<string>) => {
      state.tagFilterCon = action.payload;
    },
    setTagFilterAct: (state, action: PayloadAction<boolean>) => {
      state.tagFilterAct = action.payload;
    },
    setSorterCon: (state, action: PayloadAction<number>) => {
      state.sorterCon = action.payload;
    },
    setSorterAct: (state, action: PayloadAction<boolean>) => {
      state.sorterAct = action.payload;
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
  setDeleteAction,
  setUrlFilterCon,
  setUrlFilterAct,
  setLabFilterCon,
  setLabFilterAct,
  setTagFilterCon,
  setTagFilterAct,
  setSorterCon,
  setSorterAct
} = recSlice.actions;

export default recSlice.reducer;
