import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import FloatingContainer from "./components/floatingContainer";
import SettingsContextProvider, { ISettings } from "./context";
import "./output.css";
import "./utils/i18n";
import packageJson from "../package.json";

const HermineChat = (settings: ISettings) => {
  Sentry.init({
    dsn: "https://0792746c0b33b1c795864f17e7fefa45@sentry.zauberware.com/32",
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.5,
    sampleRate: 0.5,
    enableTracing: true,
    release: packageJson.version,
    tracePropagationTargets: [/hermine.ai/, /localhost/],
    integrations: [
      new Sentry.BrowserTracing({
        traceFetch: false,
        traceXHR: true,
        tracePropagationTargets: [/hermine.ai/, /localhost/],
      }),
      new Sentry.Replay({
        // Additional SDK configuration goes in here, for example:
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
  const defaultSettings = {
    location: "bottom",
    chatTitle: "KI-Chat",
    target: "https://hermine.ai",
    buttonColor: "white",
    buttonBackgroundColor: "#A01F53",
    messageColor: "white",
    messageBackgroundColor: "#A01F53",
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
      <StrictMode>
        <SettingsContextProvider settings={mergedSettings}>
          <FloatingContainer />
        </SettingsContextProvider>,
      </StrictMode>
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
