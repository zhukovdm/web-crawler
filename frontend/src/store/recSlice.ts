import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";
import { RecordFullType } from "../domain/types";

type RecInitialStateType = {
  records: RecordFullType[];
  getAllAction: boolean;
  createAction: boolean;
  executAction: boolean;
  updateAction: boolean;
  deleteAction: boolean;
  labFilterAct: boolean;
  labFilterCon: string;
  urlFilterAct: boolean;
  urlFilterCon: string;
  tagFilterAct: boolean;
  tagFilterCon: string;
  sorterAct: boolean;
  sorterCon: number;
  urlSorterAsc: boolean;
  timSorterAsc: boolean;
};

const initialState = (): RecInitialStateType => ({
  records: [],
  getAllAction: true,
  createAction: false,
  executAction: false,
  updateAction: false,
  deleteAction: false,
  labFilterAct: false,
  labFilterCon: "",
  urlFilterAct: false,
  urlFilterCon: "",
  tagFilterAct: false,
  tagFilterCon: "",
  sorterAct: false,
  sorterCon: 0,
  urlSorterAsc: true,
  timSorterAsc: true
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
    setLabFilterAct: (state, action: PayloadAction<boolean>) => {
      state.labFilterAct = action.payload;
    },
    setLabFilterCon: (state, action: PayloadAction<string>) => {
      state.labFilterCon = action.payload;
    },
    setUrlFilterAct: (state, action: PayloadAction<boolean>) => {
      state.urlFilterAct = action.payload;
    },
    setUrlFilterCon: (state, action: PayloadAction<string>) => {
      state.urlFilterCon = action.payload;
    },
    setTagFilterAct: (state, action: PayloadAction<boolean>) => {
      state.tagFilterAct = action.payload;
    },
    setTagFilterCon: (state, action: PayloadAction<string>) => {
      state.tagFilterCon = action.payload;
    },
    setSorterAct: (state, action: PayloadAction<boolean>) => {
      state.sorterAct = action.payload;
    },
    setSorterCon: (state, action: PayloadAction<number>) => {
      state.sorterCon = action.payload;
    },
    setUrlSorterAsc: (state, action: PayloadAction<boolean>) => {
      state.urlSorterAsc = action.payload;
    },
    setTimSorterAsc: (state, action: PayloadAction<boolean>) => {
      state.timSorterAsc = action.payload;
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
  setLabFilterAct,
  setLabFilterCon,
  setUrlFilterAct,
  setUrlFilterCon,
  setTagFilterAct,
  setTagFilterCon,
  setSorterAct,
  setSorterCon,
  setUrlSorterAsc,
  setTimSorterAsc
} = recSlice.actions;

export default recSlice.reducer;
