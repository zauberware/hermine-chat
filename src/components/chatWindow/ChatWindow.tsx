import React, { useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import { sendMessage } from "../../api";
import { IMessage, useSettings } from "../../context";
import { createFetchConfig } from "../../utils";
import ChatMessage from "../chatMessage";
import Close from "../../assets/images/close.svg";
import Send from "../../assets/images/send.svg";
import "./ChatWindow.css";
import { ChatWindowProps } from "./ChatWindow.types";
import { warn } from "console";

const ChatWindow: React.FC<ChatWindowProps> = ({ close }) => {
  const styles = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    delay: 0,
    config: {
      duration: 0.2,
    },
  });
  const {
    settings,
    resetConversation,
    conversationId,
    conversation,
    fetchConversation,
  } = useSettings();
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

  const onResetChat = async (e: any) => {
    e.preventDefault();
    resetConversation();
    close()
  };

  useEffect(() => {
    lastMessage.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [lastMessage, conversation?.messages]);

  return (
    <animated.div
      style={styles}
      className="flex flex-col flex-grow h-auto bg-white shadow-2xl rounded-lg overflow-hidden max-h-1-2 chat-window"
    >
      <div className="row bg-gray-200 text-center p-4 flex">
        <div className="col-auto text-center">{settings.chatTitle}</div>
        <div
          className="col-auto text-center justify-self-end ml-auto cursor-pointer text-black hover:text-gray-400"
          onClick={close}
        >
          <Close width="24" height="24" />
        </div>
      </div>
      <div className="flex flex-col flex-grow p-4 overflow-auto">
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

      <div className="bg-gray-300 p-4 pb-2 w-full flex-col">
        <form onSubmit={onSubmit} className="flex w-full">
          <input
            className="flex items-center h-10 w-full rounded-l px-3 text-sm outline-0"
            name="message"
            type="text"
            placeholder="Type your message…"
          />
          <button
            style={{
              background: settings.buttonBackgroundColor,
              color: settings.buttonColor,
            }}
            className="w-auto text-center px-3 rounded-r hover:opacity-90"
            type="submit"
          >
            <Send width={24} height={24} />
          </button>
        </form>
        <div className="flex justify-end">
          <button
            className="w-auto text-xs pt-1 text-end text-gray-700 hover:underline hover:opacity-90"
            type="button"
            onClick={onResetChat}
          >
            Reset
          </button>
        </div>
      </div>
    </animated.div>
  );
};

export default ChatWindow;
