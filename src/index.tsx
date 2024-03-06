export * from "./components";

import { createRoot } from "react-dom/client";
import FloatingButton from "./components/floatingButton";
import "./output.css";

// Render your React component instead
const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(<FloatingButton testIdPrefix="chat" theme="primary" />);
