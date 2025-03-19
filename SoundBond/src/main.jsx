import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store";
import { Provider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </Provider>
);
