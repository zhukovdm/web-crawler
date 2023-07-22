import {
  PayloadAction,
  createSlice,
} from "@reduxjs/toolkit";
import { WebsiteType, } from "../domain/types";

export type VisModeType = "static" | "live";

type VisInitialStateType = {
  mode: VisModeType;
  websites: WebsiteType[];
  selection: boolean[];
};

const initialState = (): VisInitialStateType => ({
  mode: "static",
  websites: [],
  selection: [],
});

export const visSlice = createSlice({
  name: "vis",
  initialState: (initialState()),
  reducers: {
    setVisMode: (state, action: PayloadAction<VisModeType>) => {
      state.mode = action.payload;
    },
    setWebsites: (state, action: PayloadAction<WebsiteType[]>) => {
      state.websites = action.payload;
      state.selection = Array(state.websites.length).fill(false);
    },
    setSelection: (state, action: PayloadAction<{ value: boolean, index: number }>) => {
      const { value, index } = action.payload;
      state.selection = [...state.selection.slice(0, index), value, ...state.selection.slice(index + 1)];
    },
  },
});

export const {
  setVisMode,
  setWebsites,
  setSelection,
} = visSlice.actions;

export default visSlice.reducer;
