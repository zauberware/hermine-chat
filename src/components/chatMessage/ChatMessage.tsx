import moment from "moment";
import React from "react";
import Icon from "../../assets/images/logo.svg";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";
import "./ChatMessage.css";
import { ChatMessageProps } from "./ChatMessage.types";

moment.updateLocale("de", {
  relativeTime: {
    future: "in %s",
    past: "vor %s",
    s: "einem Augenblick",
    ss: "%d Sekunden",
    m: "einer Minute",
    mm: "%d Minuten",
    h: "einer Stunde",
    hh: "%d Stunden",
    d: "einem Tag",
    dd: "%d Tagen",
    w: "einer Woche",
    ww: "%d Wochen",
    M: "einem Monat",
    MM: "%d Monaten",
    y: "einem Jahr",
    yy: "%d Jahren",
  },
});

const ChatMessage: React.FC<ChatMessageProps> = ({ message, lastMessage }) => {
  const { theme, settings } = useSettings();
  const renderAiMessage = () => (
    <div
      ref={lastMessage}
      id={message.id}
      className="flex w-full mt-2 space-x-3"
    >
      <div
        style={{
          backgroundImage: theme.ai_icon
            ? `url(${getLogoUrl(theme?.ai_icon)})`
            : Icon,
        }}
        className="flex-shrink-0 h-10 w-10 rounded-full bg-contain bg-center bg-no-repeat"
      ></div>
      <div>
        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          {message.result === "..." ? (
            <div class="w-10 h-10 rounded-full animate-spin border-4 border-dashed border-black border-t-transparent m-4"></div>
          ) : (
            <p className="text-sm mb-0">{message.result}</p>
          )}
        </div>
        <div className="text-xs text-gray-500 leading-none pt-1 pb-2">
          {moment(message.updated_at).fromNow()}
        </div>
      </div>
    </div>
  );

  const messageStyle = {
    color: settings.userMessageColor,
    backgroundColor: settings.userMessageBackgroundColor,
  };

  const renderHumanMessage = () => (
    <div
      ref={lastMessage}
      id={message.id}
      className="flex w-full mt-2 space-x-3 ml-auto justify-end"
    >
      <div>
        <div style={messageStyle} className="p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm mb-0">{message.result}</p>
        </div>
        <div className="text-xs text-gray-500 leading-none text-end pt-1 pb-2">
          {moment(message.updated_at).fromNow()}
        </div>
      </div>
    </div>
  );

  return message.message_type === "ai"
    ? renderAiMessage()
    : renderHumanMessage();
};

export default ChatMessage;
