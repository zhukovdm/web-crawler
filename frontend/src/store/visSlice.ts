import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";
import { WebsiteType } from "../domain/types";

type VisInitialStateType = {
  websites: WebsiteType[];
  selection: boolean[];
};

const initialState = (): VisInitialStateType => ({
  websites: [],
  selection: []
});

export const visSlice = createSlice({
  name: "vis",
  initialState: (initialState()),
  reducers: {
    setWebsites: (state, action: PayloadAction<WebsiteType[]>) => {
      state.websites = action.payload;
      state.selection = Array(state.websites.length).fill(false);
    },
    setSelection: (state, action: PayloadAction<{ value: boolean, index: number }>) => {
      const { value, index } = action.payload;
      state.selection = [...state.selection.slice(0, index), value, ...state.selection.slice(index + 1)];
    }
  }
});

export const {
  setWebsites,
  setSelection
} = visSlice.actions;

export default visSlice.reducer;
