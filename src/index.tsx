import { createRoot } from "react-dom/client";
import FloatingContainer from "./components/floatingContainer";
import SettingsContextProvider, { ISettings } from "./context";
import "./output.css";

const HermineChat = (settings: ISettings) => {
  console.log("settings", settings);
  const defaultSettings = {
    location: "bottom",
    chatTitle: "KI-Chat",
  };
  const mergedSettings = {
    ...defaultSettings,
    ...settings,
  } as ISettings;
  try {
    const root = createRoot(
      document.getElementById("hermine-chat-container") as HTMLElement,
    );
    root.render(
      <SettingsContextProvider settings={mergedSettings}>
        <FloatingContainer />
      </SettingsContextProvider>,
    );
  } catch {
    console.error(
      "Could not mount react component. Add an element with id 'hermine-chat-container'.",
    );
  }
};

declare const window: any;
window.HermineChat = HermineChat;

export { HermineChat };
export default HermineChat;
