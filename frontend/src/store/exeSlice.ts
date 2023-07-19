import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";
import { ExecutionFullType } from "../domain/types";

type ExeInitialStateType = {
  executions: ExecutionFullType[];
  getAllAction: boolean;
  exeFilterAct: boolean;

  /**
   * recId of the corresponding record.
   */
  exeFilterCon: number | undefined;
};

const initialState = (): ExeInitialStateType => ({
  executions: [],
  getAllAction: true,
  exeFilterAct: false,
  exeFilterCon: 0
});

export const exeSlice = createSlice({
  name: "exe",
  initialState: (initialState()),
  reducers: {
    setExecutions: (state, action: PayloadAction<ExecutionFullType[]>) => {
      state.executions = action.payload;
    },
    setGetAllAction: (state, action: PayloadAction<boolean>) => {
      state.getAllAction = action.payload;
    },
    setExeFilterAct: (state, action: PayloadAction<boolean>) => {
      state.exeFilterAct = action.payload;
    },
    setExeFilterCon: (state, action: PayloadAction<number>) => {
      state.exeFilterCon = action.payload;
    }
  }
});

export const {
  setExecutions,
  setGetAllAction,
  setExeFilterAct,
  setExeFilterCon
} = exeSlice.actions;

export default exeSlice.reducer;
