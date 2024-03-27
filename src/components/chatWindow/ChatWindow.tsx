import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { sendMessage } from "../../api";
import { IMessage, useSettings } from "../../context";
import { createFetchConfig } from "../../utils";
import ChatMessage from "../chatMessage";
import Close from "../../assets/images/close.svg";
import Send from "../../assets/images/send.svg";
import "./ChatWindow.css";
import { ChatWindowProps } from "./ChatWindow.types";
import { useTranslation } from "react-i18next";

const ChatWindow: React.FC<ChatWindowProps> = ({ close }) => {
  const {
    settings,
    resetConversation,
    conversationId,
    conversation,
    fetchConversation,
  } = useSettings();
  const lastMessage = useRef<HTMLDivElement>(null);
  const fetchConfig = createFetchConfig(settings.agentSlug, settings.accountId);
  const { t } = useTranslation("translation");

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { message } = Object.fromEntries(formData);
    const response = await sendMessage(
      message,
      conversationId as string,
      settings.target,
      {
        ...fetchConfig,
        method: "POST",
      },
    );
    e.target.reset();
    console.debug("response of message create: ", response);
    fetchConversation();
    lastMessage?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  };

  const onResetChat = async (e: any) => {
    e.preventDefault();
    resetConversation();
    close();
  };

  useEffect(() => {
    lastMessage.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [lastMessage, conversation?.messages]);

  const PRIVACY_KEY = "hermine_chat_privacy_accepted";
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(
    localStorage.getItem(PRIVACY_KEY) === "true",
  );
  const onAgreePrivacy = () => {
    localStorage.setItem(PRIVACY_KEY, "true");
    setPrivacyAccepted(true);
  };
  return (
    <div
      className="flex flex-col flex-grow h-auto bg-white shadow-2xl rounded-lg overflow-hidden chat-window relative"
    >
      {privacyAccepted ? null : (
        <div className="absolute w-full h-full bg-gray-100 flex justify-center items-center text-center p-5 flex-col">
          <div className="p-5">
            <Markdown>{conversation?.privacyDisclaimer}</Markdown>
          </div>
          <div>
            <button
              style={{
                background: settings.buttonBackgroundColor,
                color: settings.buttonColor,
              }}
              className="w-auto text-center p-2 rounded hover:opacity-90"
              type="button"
              onClick={onAgreePrivacy}
            >
              {t("acceptPrivacy")}
            </button>
          </div>
        </div>
      )}
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
        {conversation?.messages?.map((message: IMessage, index: number) => (
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
            placeholder={t("input.placeholder")}
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
            {t("reset")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
