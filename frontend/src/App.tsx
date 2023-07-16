import { Provider } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import { Divider } from "@mui/material";
import { store } from "./store";
import NavigationBar from "./components/shared/NavigationBar";
import RecPage from "./components/RecPage";
import ExePage from "./components/ExePage";
import VisPage from "./components/VisPage";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavigationBar />
        <Divider light />
        <Routes>
          <Route path={"/rec"} element={<RecPage />} />
          <Route path={"/exe"} element={<ExePage />} />
          <Route path={"/vis"} element={<VisPage />} />
          <Route path={"*"} element={<Navigate to={"/rec"} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
