import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import Icon from "../../assets/images/logo.svg";
import RefreshIcon from "../../assets/images/refresh.svg";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";
import "./ChatMessage.css";
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
      className="flex w-full mt-2 space-x-3"
    >
      {theme.ai_icon ? (
        <div
          style={{ backgroundImage: `url(${getLogoUrl(theme.ai_icon)})` }}
          className="flex-shrink-0 h-10 w-10 rounded-full bg-contain bg-center bg-no-repeat"
        ></div>
      ) : (
        <Icon className="flex-shrink-0 h-10 w-10 rounded-full" />
      )}
      <div>
        <div style={messageStyle} className="p-3 rounded-r-lg rounded-bl-lg">
          {message.has_errors ? (
            <p className="text-sm mb-0">
              {t('errorMessage')}
            </p>
          ) : (
            <>
              {message.result === "..." ? (
                <div style={{ borderColor: settings.messageColor }} className="w-10 h-10 rounded-full animate-spin border-4 border-dashed border-black border-t-transparent m-4"></div>
              ) : (
                <p className="text-sm mb-0">
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
          <button onClick={retry} className="text-xs text-gray-500 leading-none pt-1 pb-2 underline hover:text-gray-700 flex items-center">
            <RefreshIcon width={12} height={12} />
            <span className="pl-1">
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
      className="flex w-full mt-2 space-x-3 ml-auto justify-end"
    >
      <div>
        <div className="bg-gray-300 p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm mb-0">{message.result}</p>
        </div>
      </div>
    </div>
  );

  return message.message_type === "ai"
    ? renderAiMessage()
    : renderHumanMessage();
};

export default ChatMessage;
