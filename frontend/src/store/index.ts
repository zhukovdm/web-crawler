import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector
} from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import recReducer from "./recSlice";
import exeReducer from "./exeSlice";
import vizReducer from "./vizSlice";

export const store = configureStore({
  reducer: {
    rec: recReducer,
    exe: exeReducer,
    viz: vizReducer,
  }
});

type DispatchFunc = () => typeof store.dispatch;

export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
