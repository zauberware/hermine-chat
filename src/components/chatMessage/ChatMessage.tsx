import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import cx from "classnames";
import Icon from "../../assets/images/logo.svg";
import RefreshIcon from "../../assets/images/refresh.svg";
import FeedbackIcon from "../../assets/images/feedback.svg";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";
import { submitMessageFeedback } from "../../api";
import styles from "./ChatMessage.module.css";
import { ChatMessageProps } from "./ChatMessage.types";
import FeedbackDialog from "../feedbackDialog";

const ChatMessage: React.FC<ChatMessageProps> = ({ message, tryAgain }) => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const retry = useCallback(() => {
    tryAgain(message?.id);
  }, [message, tryAgain]);

  const handleFeedbackSubmit = useCallback(
    async (
      messageId: string,
      conversationId: string,
      feedback: string
    ): Promise<boolean> => {
      try {
        await submitMessageFeedback(
          conversationId,
          messageId,
          feedback,
          settings.agentSlug,
          settings.accountId,
          settings.target
        );
        return true;
      } catch (error) {
        return false;
      }
    },
    [settings.agentSlug, settings.accountId, settings.target]
  );

  const aiMessageStyle = {
    color: settings.aiMessageTextColor || settings.messageColor,
    backgroundColor:
      settings.aiMessageBackgroundColor || settings.messageBackgroundColor,
  };

  const userMessageStyle = {
    color: settings.messageTextColor || "white",
    backgroundColor: settings.messageBackgroundColor || "#e5e7eb",
  };

  const renderAiMessage = () => (
    <div id={message.id} className={styles.aiMessageContainer}>
      <div id={styles.chatMessageContainer}>
        <div style={aiMessageStyle} className={styles.textContainer}>
          {message.has_errors ? (
            <p className={styles.error}>{t("errorMessage")}</p>
          ) : (
            <>
              {message.result === "..." ? (
                <div
                  style={{
                    borderColor:
                      settings.aiMessageTextColor || settings.messageColor,
                  }}
                  className={styles.loading}
                ></div>
              ) : (
                <div className={styles.messageContent}>
                  <p className={styles.text}>
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
                      {message.result}
                    </Markdown>
                  </p>
                  {!message.has_errors && (
                    <div className={styles.feedbackButtonContainer}>
                      <button
                        onClick={() => setShowFeedbackDialog(true)}
                        className={styles.feedbackIconButton}
                        title="Feedback geben"
                      >
                        <FeedbackIcon
                          width={16}
                          height={16}
                          style={{
                            color:
                              settings.aiMessageTextColor ||
                              settings.messageColor ||
                              "#6b7280",
                          }}
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        {message.has_errors && (
          <button onClick={retry} className={styles.retryButton}>
            <RefreshIcon width={12} height={12} />
            <span className={styles["pl-1"]}>{t("tryAgain")}</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderHumanMessage = () => (
    <div id={message.id} className={cx(styles.humanMessageContainer)}>
      <div
        className={styles.humanMessage}
        style={
          {
            ...userMessageStyle,
            "--user-text-color": userMessageStyle.color,
          } as React.CSSProperties & { "--user-text-color": string }
        }
      >
        <div className={styles.text}>
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
            className={`reactMarkDown ${styles.humanMarkdown}`}
          >
            {message.result}
          </Markdown>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div id={styles.messageContainer}>
        {message.message_type === "ai"
          ? renderAiMessage()
          : renderHumanMessage()}
      </div>
      {showFeedbackDialog && (
        <div
          className={styles.feedbackOverlay}
          onClick={() => setShowFeedbackDialog(false)}
        >
          <FeedbackDialog
            isOpen={showFeedbackDialog}
            onClose={() => setShowFeedbackDialog(false)}
            messageId={message.id}
            conversationId={message.conversation_id}
            onSubmitFeedback={handleFeedbackSubmit}
          />
        </div>
      )}
    </>
  );
};

export default ChatMessage;
