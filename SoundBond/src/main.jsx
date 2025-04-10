import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PlayerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PlayerProvider>
  </Provider>
);
