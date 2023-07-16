import { Provider } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import { store } from "./store";
import NavigationBar from "./components/NavigationBar";
import RecPage from "./components/RecPage";
import ExePage from "./components/ExePage";
import VisPage from "./components/VisPage";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavigationBar />
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
