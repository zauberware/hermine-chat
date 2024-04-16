import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import cx from 'classnames'
import Icon from "../../assets/images/logo.svg";
import RefreshIcon from "../../assets/images/refresh.svg";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";
import styles from "./ChatMessage.module.css";
import { ChatMessageProps } from "./ChatMessage.types";

const ChatMessage: React.FC<ChatMessageProps> = ({ message, tryAgain }) => {
  const { theme, settings } = useSettings();
  const { t } = useTranslation()

  const retry = useCallback(() => {
    tryAgain(message?.id)
  }, [message, tryAgain])

  const messageStyle = {
    color: settings.messageColor,
    backgroundColor: settings.messageBackgroundColor,
  };

  const renderAiMessage = () => (
    <div
      id={message.id}
      className={styles.aiMessageContainer}
    >
      {theme.ai_icon ? (
        <div
          style={{ backgroundImage: `url(${getLogoUrl(theme.ai_icon)})` }}
          className={styles.icon}
        ></div>
      ) : (
        <Icon className={styles.icon} />
      )}
      <div>
        <div style={messageStyle} className={styles.textContainer}>
          {message.has_errors ? (
            <p className={styles.error}>
              {t('errorMessage')}
            </p>
          ) : (
            <>
              {message.result === "..." ? (
                <div style={{ borderColor: settings.messageColor }} className={styles.loading}></div>
              ) : (
                <p className={styles.text}>
                  <Markdown
                    components={{
                      a: ({ href, children, ...props }) => <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
                    }}
                    className="reactMarkDown"
                  >
                    {message.result}
                  </Markdown>
                </p>
              )}
            </>
          )}
        </div>
        {message.has_errors ? (
          <button onClick={retry} className={styles.retryButton}>
            <RefreshIcon width={12} height={12} />
            <span className={styles["pl-1"]}>
              {t('tryAgain')}
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );

  const renderHumanMessage = () => (
    <div
      id={message.id}
      className={cx(styles.humanMessageContainer)}
    >
      <div>
        <div className={styles.humanMessage}>
          <p className={styles.text}>{message.result}</p>
        </div>
      </div>
    </div >
  );

  return (
    <div id={styles.messageContainer}>
      {message.message_type === "ai"
        ? renderAiMessage()
        : renderHumanMessage()}
    </div>
  )
};

export default ChatMessage;
