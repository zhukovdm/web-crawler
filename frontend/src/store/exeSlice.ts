import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";

type ExeInitialStateType = {
  exeFilterAct: boolean;

  /**
   * recId of the corresponding record.
   */
  exeFilterCon: number | undefined;
};

const initialState = (): ExeInitialStateType => ({
  exeFilterAct: false,
  exeFilterCon: undefined
});

export const exeSlice = createSlice({
  name: "exe",
  initialState: (initialState()),
  reducers: {
    setExeFilterAct: (state, action: PayloadAction<boolean>) => {
      state.exeFilterAct = action.payload;
    },
    setExeFilterCon: (state, action: PayloadAction<number | undefined>) => {
      state.exeFilterCon = action.payload;
    }
  }
});

export const {
  setExeFilterAct,
  setExeFilterCon
} = exeSlice.actions;

export default exeSlice.reducer;
