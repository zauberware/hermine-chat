export * from "./components";

import { createRoot } from "react-dom/client";
import FloatingContainer, {
  SettingsProps,
} from "./components/floatingContainer";
import "./output.css";

const Settings = (settings: SettingsProps) => {
  console.log("settings", settings);
  const defaultSettings = {
    location: "bottom",
  };
  const mergedSettings = {
    ...defaultSettings,
    ...settings,
  } as SettingsProps;
  const root = createRoot(document.getElementById("app") as HTMLElement);
  root.render(<FloatingContainer settings={mergedSettings} />);
};

export default Settings;
