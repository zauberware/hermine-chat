import React, { useEffect, useRef } from "react";
import { sendMessage } from "../../api";
import { IMessage, useSettings } from "../../context";
import { createFetchConfig } from "../../utils";
import ChatMessage from "../chatMessage";
import "./ChatWindow.css";
import { ChatWindowProps } from "./ChatWindow.types";

const ChatWindow: React.FC<ChatWindowProps> = () => {
  const { settings, conversationId, conversation, fetchConversation } =
    useSettings();
  const lastMessage = useRef<HTMLDivElement>(null);
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
    console.debug("response of message create: ", response);
    fetchConversation();
    lastMessage?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    lastMessage.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [lastMessage, conversation?.messages]);

  return (
    <div className="flex flex-col flex-grow h-auto w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden max-h-1-2">
      <div className="bg-gray-200 text-center p-4">{settings.chatTitle}</div>
      <div
        className="flex flex-col flex-grow p-4 overflow-auto"
      >
        {conversation?.messages.map((message: IMessage, index: number) => (
          <ChatMessage
            key={`${message.id}-${message.result}`}
            message={message}
            {...(index === conversation.messages.length - 1
              ? { lastMessage }
              : {})}
          />
        ))}
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
