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
  createAction: boolean;
  executAction: boolean;
};

const initialState = (): VisInitialStateType => ({
  mode: "static",
  node: undefined,
  selection: [],
  websites: [],
  createAction: false,
  executAction: false
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
    },
    appendWebsite: (state, action: PayloadAction<WebsiteType>) => {
      state.mode = "live";
      state.websites.push(action.payload);
      state.selection.push(true);
    },
    setCreateAction: (state, action: PayloadAction<boolean>) => {
      state.createAction = action.payload;
    },
    setExecutAction: (state, action: PayloadAction<boolean>) => {
      state.executAction = action.payload;
    }
  },
});

export const {
  setMode,
  setNode,
  setWebsites,
  setSelection,
  appendWebsite,
  setCreateAction,
  setExecutAction
} = visSlice.actions;

export default visSlice.reducer;
