import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { retry, sendMessage } from "../../api";
import { IMessage, useSettings } from "../../context";
import { createFetchConfig, getLogoUrl } from "../../utils";
import ChatMessage from "../chatMessage";
import SplashScreen from "../splashScreen";
import Close from "../../assets/images/close.svg";
import Send from "../../assets/images/send.svg";
import styles from "./ChatWindow.module.css";
import { ChatWindowProps } from "./ChatWindow.types";
import { useTranslation } from "react-i18next";

const ChatWindow: React.FC<ChatWindowProps> = ({ close }) => {
  const {
    settings,
    theme,
    resetConversation,
    conversationId,
    conversation,
    fetchConversation,
  } = useSettings();
  const chatContainer = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fetchConfig = createFetchConfig(settings.agentSlug, settings.accountId);
  const { t, i18n } = useTranslation("translation");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { message } = Object.fromEntries(formData);

    if (!message || message.toString().trim() === "") {
      return;
    }

    const response = await sendMessage(
      message,
      conversationId as string,
      settings.target,
      {
        ...fetchConfig,
        method: "POST",
      }
    );
    e.target.reset();

    // Textarea-Höhe und Overflow nach dem Leeren zurücksetzen
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }

    console.debug("response of message create: ", response);
    fetchConversation();
    setTimeout(scrollToLastMessage, 200);
  };

  const sendPrompt = async (message: string) => {
    const response = await sendMessage(
      message,
      conversationId as string,
      settings.target,
      {
        ...fetchConfig,
        method: "POST",
      }
    );
    console.debug("response of message create: ", response);
    fetchConversation();
    setTimeout(scrollToLastMessage, 200);
  };

  const tryAgain = async (messageId: string) => {
    console.debug("Initiating a retry of the latest message.");
    const response = await retry(messageId, settings.target, {
      ...fetchConfig,
      method: "POST",
    });
    console.debug("response of rerun api call: ", response);
    fetchConversation();
    setTimeout(scrollToLastMessage, 200);
  };

  const onResetChat = async (e: any) => {
    e.preventDefault();
    resetConversation();
    close();
  };

  const scrollToLastMessage = () => {
    console.debug("scrolling...");
    chatContainer.current?.scrollTo({ top: 9999, behavior: "smooth" });
  };

  // Funktion zur automatischen Anpassung der Textarea-Höhe
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 96; // Maximale Höhe in px (4 Zeilen)
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;

      // Overflow-Verhalten basierend auf der Höhe anpassen
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  useEffect(() => {
    setTimeout(scrollToLastMessage, 200);
  }, [chatContainer]);

  // Textarea-Höhe bei Mount anpassen
  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const PRIVACY_KEY = "hermine_chat_privacy_accepted";
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(
    localStorage.getItem(PRIVACY_KEY) === "true"
  );
  const onAgreePrivacy = () => {
    localStorage.setItem(PRIVACY_KEY, "true");
    setPrivacyAccepted(true);
  };
  console.debug("conversation.messages", conversation?.messages);

  const getShadowStyle = (shadow?: string) => {
    switch (shadow) {
      case "none":
        return "none";
      case "small":
        return "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)";
      case "large":
        return "0 25px 50px -12px rgb(0 0 0 / 0.25)";
      default:
        return "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
    }
  };

  const titleStyle = {
    color: settings.chatTitleColor || "black",
    textDecorationColor: settings.chatTitleColor || "black",
  };

  const subTitleStyle = {
    color: settings.chatSubTitleColor || "#6B7280",
  };

  const chatWindowStyle = {
    backgroundColor: settings.chatBackgroundColor || "white",
    boxShadow: getShadowStyle(settings.shadow),
    ...(isFullScreen
      ? {
          backgroundColor: "rgb(255, 255, 255)",
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
          width: "80vw",
          height: "70vh",
          maxHeight: "80vh",
          maxWidth: "80vw",
          borderRadius: "8px",
          zIndex: 9999,
        }
      : {}),
  };

  const toggleFullScreen = () => {
    if (settings.fullScreenEnabled) {
      setIsFullScreen(!isFullScreen);
    }
  };

  const placeholder =
    settings.textInputPlaceholder ||
    (i18n.language === "de"
      ? conversation?.inputPlaceholderDe
      : conversation?.inputPlaceholderEn);

  const target = `${settings.target}/c/${settings.accountId}/${settings.agentSlug}?conversation_id=${conversationId}`;
  return (
    <div id={styles.chatWindow} style={chatWindowStyle}>
      {privacyAccepted ? (
        <div
          id={styles.chatContainer}
          className={isFullScreen ? styles.fullscreenMode : ""}
        >
          <div id={styles.topContainer}>
            {/* Header with logo, title, subtitle and actions */}
            <div id={styles.headerContainer}>
              {/* Left side: Logo, Title and Subtitle */}
              <div id={styles.leftSection}>
                <img
                  id={styles.logo}
                  src={getLogoUrl(theme.logo)}
                  alt="AI Logo"
                  style={{
                    maxHeight: "40px",
                    objectFit: "contain",
                    alignItems: "left",
                  }}
                />
                {(settings.chatTitle || settings.chatSubTitle) && (
                <div id={styles.titleSection}>
                  {settings.chatTitle && (
                    settings.withConversationManagement ? (
                    <a
                      href={target}
                      style={titleStyle}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={styles.conversationManagement}
                    >
                      <div id={styles.title} style={titleStyle}>
                        {settings.chatTitle}
                      </div>
                    </a>
                  ) : (
                    <div id={styles.title} style={titleStyle}>
                      {settings.chatTitle}
                    </div>
                    )
                  )}
                  {settings.chatSubTitle && (
                    <div id={styles.subTitle} style={subTitleStyle}>
                      {settings.chatSubTitle}
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* Right side: Actions side by side */}
              <div id={styles.rightSection}>
                {settings.fullScreenEnabled && (
                  <button
                    id={styles.fullScreenButton}
                    onClick={toggleFullScreen}
                    title={
                      isFullScreen ? "Fenster verkleinern" : "Vollbild anzeigen"
                    }
                  >
                    {isFullScreen ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                    )}
                  </button>
                )}
                <button
                  id={styles.closeIcon}
                  onClick={close}
                  aria-label="Close chat"
                >
                  <Close width="24" height="24" />
                </button>
              </div>
            </div>
          </div>

          {(conversation?.messages?.length || 0) > 1 ? (
            <div ref={chatContainer} id={styles.messagesContainer}>
              {conversation?.messages?.map((message: IMessage) => (
                <ChatMessage
                  key={`${message.id}-${message.result}`}
                  message={message}
                  tryAgain={tryAgain}
                />
              ))}
            </div>
          ) : (
            <SplashScreen sendMessage={sendPrompt} />
          )}

          <div id={styles.formContainer}>
            <form onSubmit={onSubmit} id={styles.form}>
              <textarea
                ref={textareaRef}
                id={styles.input}
                name="message"
                placeholder={placeholder || t("input.placeholder")}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{
                  resize: "none",
                  overflow: "hidden",
                  minHeight: "24px",
                  maxHeight: "96px", // 4 Zeilen à 24px
                }}
              />
              <button
                style={{
                  background: settings.buttonBackgroundColor,
                  color: settings.buttonColor,
                }}
                id={styles.button}
                type="submit"
              >
                <Send width={24} height={24} />
              </button>
            </form>
            <div id={styles.resetButtonContainer}>
              <button
                id={styles.resetButton}
                type="button"
                onClick={onResetChat}
              >
                {t("reset")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div id={styles.privacyContainer}>
          <div id={styles["p-5"]}>
            <Markdown
              components={{
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
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
              id={styles.acceptButton}
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
