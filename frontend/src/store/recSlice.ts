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
  urlFilterAct: boolean;
  urlFilterCon: string;
  labFilterAct: boolean;
  labFilterCon: string;
  tagFilterAct: boolean;
  tagFilterCon: string;
  sorterAct: boolean;
  sorterCon: number;
};

const initialState = (): RecInitialStateType => ({
  records: [],
  getAllAction: true,
  createAction: false,
  executAction: false,
  updateAction: false,
  deleteAction: false,
  urlFilterAct: false,
  urlFilterCon: "",
  labFilterAct: false,
  labFilterCon: "",
  tagFilterAct: false,
  tagFilterCon: "",
  sorterAct: false,
  sorterCon: 0
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
    setUrlFilterAct: (state, action: PayloadAction<boolean>) => {
      state.urlFilterAct = action.payload;
    },
    setUrlFilterCon: (state, action: PayloadAction<string>) => {
      state.urlFilterCon = action.payload;
    },
    setLabFilterAct: (state, action: PayloadAction<boolean>) => {
      state.labFilterAct = action.payload;
    },
    setLabFilterCon: (state, action: PayloadAction<string>) => {
      state.labFilterCon = action.payload;
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
  setUrlFilterAct,
  setUrlFilterCon,
  setLabFilterAct,
  setLabFilterCon,
  setTagFilterAct,
  setTagFilterCon,
  setSorterAct,
  setSorterCon
} = recSlice.actions;

export default recSlice.reducer;
