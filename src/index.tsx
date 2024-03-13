import { createRoot } from "react-dom/client";
import FloatingContainer from "./components/floatingContainer";
import SettingsContextProvider, { ISettings } from "./context";
import "./output.css";

const HermineChat = (settings: ISettings) => {
  console.log("settings", settings);
  const defaultSettings = {
    location: "bottom",
    chatTitle: "KI-Chat",
    buttonColor: "white",
    buttonBackgroundColor: "#A01F53",
    userMessageColor: "white",
    userMessageBackgroundColor: "#A01F53",
  };
  const mergedSettings = {
    ...defaultSettings,
    ...settings,
  } as ISettings;
  try {
    const div = document.createElement("div");
    div.id = "hermine-chat-container";
    document.body.appendChild(div);
    const root = createRoot(div);
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
