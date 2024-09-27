/* eslint-disable import/order */
import ReactDOM from "react-dom/client";

import { App } from "./containers/App";

import "./styles/index.scss";
import { Buffer } from "buffer";

// Extend the Window interface to include Buffer
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
