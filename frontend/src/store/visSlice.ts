import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";
import {
  NodeStoreType,
  WebsiteType
} from "../domain/types";

export type VisModeType = "static" | "live";

type VisInitialStateType = {
  mode: VisModeType;
  node: NodeStoreType | undefined;
  selection: boolean[];
  websites: WebsiteType[];
};

const initialState = (): VisInitialStateType => ({
  mode: "static",
  node: undefined,
  selection: [],
  websites: []
});

export const visSlice = createSlice({
  name: "vis",
  initialState: (initialState()),
  reducers: {
    setMode: (state, action: PayloadAction<VisModeType>) => {
      state.mode = action.payload;
    },
    setNode: (state, action: PayloadAction<NodeStoreType | undefined>) => {
      state.node = action.payload;
    },
    setWebsites: (state, action: PayloadAction<WebsiteType[]>) => {
      state.websites = action.payload;
      state.selection = Array(state.websites.length).fill(false);
    },
    setSelection: (state, action: PayloadAction<{ value: boolean, index: number }>) => {
      const { value, index } = action.payload;
      state.selection = [...state.selection.slice(0, index), value, ...state.selection.slice(index + 1)];
    }
  },
});

export const {
  setMode,
  setNode,
  setWebsites,
  setSelection
} = visSlice.actions;

export default visSlice.reducer;
