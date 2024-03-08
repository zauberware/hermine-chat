import React from "react";
import { sendMessage } from "../../api";
import { IMessage, useSettings } from "../../context";
import { createFetchConfig } from "../../utils";
import "./ChatWindow.css";
import { ChatWindowProps } from "./ChatWindow.types";

const ChatWindow: React.FC<ChatWindowProps> = () => {
  const { settings, conversationId, conversation } = useSettings();
  console.log("conversation", conversation);
  const fetchConfig = createFetchConfig(settings.agentSlug, settings.accountId);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { message } = Object.fromEntries(formData);
    const response = await sendMessage(message, conversationId as string, {
      ...fetchConfig,
      method: "POST",
    });
    e.target.reset();
    console.log("response", response);
  };

  const renderAiMessage = (message: IMessage) => (
    <div className="flex w-full mt-2 space-x-3 max-w-xs">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
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

  const renderHumanMessage = (message: IMessage) => (
    <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
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
  return (
    <div className="flex flex-col flex-grow h-auto w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden max-h-1-2">
      <div className="flex flex-col flex-grow p-4 overflow-auto">
        {conversation?.messages.map((message: IMessage) => {
          if (message.message_type == "ai") {
            return renderAiMessage(message);
          } else if (message.message_type == "user") {
            return renderHumanMessage(message);
          }
        })}
      </div>

      <form onSubmit={onSubmit}>
        <div className="bg-gray-300 p-4">
          <input
            className="flex items-center h-10 w-full rounded px-3 text-sm"
            name="message"
            type="text"
            placeholder="Type your message…"
          />
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
