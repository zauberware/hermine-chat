import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import cx from 'classnames'
import { retry, sendMessage } from "../../api";
import { IMessage, useSettings } from "../../context";
import { createFetchConfig } from "../../utils";
import ChatMessage from "../chatMessage";
import Close from "../../assets/images/close.svg";
import Send from "../../assets/images/send.svg";
import styles from "./ChatWindow.module.css";
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
  const chatContainer = useRef<HTMLDivElement>(null);
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
    setTimeout(scrollToLastMessage, 200);
  };

  const tryAgain = async (messageId: string) => {
    console.debug('Initiating a retry of the latest message.')
    const response = await retry(
      messageId,
      settings.target,
      {
        ...fetchConfig,
        method: "POST",
      },
    );
    console.debug("response of rerun api call: ", response);
    fetchConversation();
    setTimeout(scrollToLastMessage, 200);
  }

  const onResetChat = async (e: any) => {
    e.preventDefault();
    resetConversation();
    close();
  };

  const scrollToLastMessage = () => {
    console.debug("scrolling...");
    chatContainer.current?.scrollTo({ top: 9999, behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(scrollToLastMessage, 200);
  }, [chatContainer]);

  const PRIVACY_KEY = "hermine_chat_privacy_accepted";
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(
    localStorage.getItem(PRIVACY_KEY) === "true",
  );
  const onAgreePrivacy = () => {
    localStorage.setItem(PRIVACY_KEY, "true");
    setPrivacyAccepted(true);
  };
  console.debug("conversation.messages", conversation?.messages);
  return (
    <div className={styles.chatWindow}>
      {privacyAccepted ? (
        <div className={styles.chatContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>{settings.chatTitle}</div>
            <div
              className={styles.closeIcon}
              onClick={close}
            >
              <Close width="24" height="24" />
            </div>
          </div>

          <div
            ref={chatContainer}
            className={styles.messagesContainer}
          >
            {conversation?.messages?.map((message: IMessage) => (
              <ChatMessage
                key={`${message.id}-${message.result}`}
                message={message}
                tryAgain={tryAgain}
              />
            ))}
          </div>

          <div className={styles.formContainer}>
            <form onSubmit={onSubmit} className={styles.form}>
              <input
                className={styles.input}
                name="message"
                type="text"
                placeholder={t("input.placeholder")}
              />
              <button
                style={{
                  background: settings.buttonBackgroundColor,
                  color: settings.buttonColor,
                }}
                className={styles.button}
                type="submit"
              >
                <Send width={24} height={24} />
              </button>
            </form>
            <div className={styles.resetButtonContainer}>
              <button
                className={styles.resetButton}
                type="button"
                onClick={onResetChat}
              >
                {t("reset")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.privacyContainer}>
          <div className={styles["p-5"]}>
            <Markdown
              components={{
                a: ({ href, children, ...props }) => <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
              }}
              className="reactMarkDown"
            >
              {conversation?.privacyDisclaimer}
            </Markdown>
          </div>
          <div>
            <button
              style={{
                background: settings.buttonBackgroundColor,
                color: settings.buttonColor,
              }}
              className={styles.acceptButton}
              type="button"
              onClick={onAgreePrivacy}
            >
              {t("acceptPrivacy")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
