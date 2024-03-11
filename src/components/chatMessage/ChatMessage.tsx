import React from "react";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";
import "./ChatMessage.css";
import { ChatMessageProps } from "./ChatMessage.types";

const ChatMessage: React.FC<ChatMessageProps> = ({ message, lastMessage }) => {
  const { theme } = useSettings();
  const renderAiMessage = () => (
    <div ref={lastMessage} id={message.id} className="flex w-full mt-2 space-x-3 max-w-xs">
      <div
        style={{ backgroundImage: `url(${getLogoUrl(theme?.ai_icon)})` }}
        className="flex-shrink-0 h-10 w-10 rounded-ful border-gray-300 border bg-contain rounded-full"
      ></div>
      <div>
        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          <p className="text-sm">{message.result}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">
          {new Date(message.updated_at).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );

  const renderHumanMessage = () => (
    <div
      ref={lastMessage}
      id={message.id}
      className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
    >
      <div>
        <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm">{message.result}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">
          {new Date(message.updated_at).toLocaleTimeString()}
        </span>
      </div>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
    </div>
  );

  return message.message_type === "ai"
    ? renderAiMessage()
    : renderHumanMessage();
};

export default ChatMessage;
