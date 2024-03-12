export * from "./components";

import { createRoot } from "react-dom/client";
import FloatingContainer from "./components/floatingContainer";
import SettingsContextProvider, { ISettings } from "./context";
import "./output.css";

const Settings = (settings: ISettings) => {
  console.log("settings", settings);
  const defaultSettings = {
    location: "bottom",
    chatTitle: "KI-Chat",
  };
  const mergedSettings = {
    ...defaultSettings,
    ...settings,
  } as ISettings;
  const root = createRoot(document.getElementById("app") as HTMLElement);
  root.render(
    <SettingsContextProvider settings={mergedSettings}>
      <FloatingContainer />
    </SettingsContextProvider>,
  );
};

export { Settings as ChatSettings };
export default Settings;
