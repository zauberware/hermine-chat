import React, { useEffect, useState } from "react";
import cx from "classnames";
import styles from "./FloatingContainer.module.css";
import { FloatingContainerProps } from "./FloatingContainer.types";
import ChatWindow from "../chatWindow";
import { createFetchConfig } from "../../utils";
import FloatingButton from "../floatingButton/FloatingButton";
import { subscribeChannel } from "../../utils/channels/conversation_channel";
import { useSettings } from "../../context";
import { createConversation, getTheme } from "../../api";
import { useResponsive } from "../../utils/hooks";

type Location = "center" | "bottom" | "top";

const FloatingContainer: React.FC<FloatingContainerProps> = ({
  buttonWidth: propButtonWidth,
  buttonHeight: propButtonHeight,
}) => {
  const [toggled, setToggled] = useState<boolean>(false);
  const searchParams = new URL(document.location.href).searchParams;

  useEffect(() => {
    if (searchParams.get("hermine_chat_open")) {
      setToggled(true);
      searchParams.delete("hermine_chat_open");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${searchParams.toString()}`
      );
    }
  }, [searchParams]);

  const {
    theme,
    setTheme,
    settings,
    conversationId,
    setConversationId,
    fetchConversation,
    conversation,
  } = useSettings();

  const { location } = settings;

  useEffect(() => {
    const fetchTheme = async () => {
      const newTheme = await getTheme(
        settings.agentSlug,
        settings.accountId,
        settings.target
      );

      setTheme(newTheme);
    };

    fetchTheme();
  }, [settings?.target]);

  const onNewMessage = async (data: any) => {
    console.debug("new message received: ", data);
    fetchConversation(data);
  };

  useEffect(() => {
    const getConversationId = async () => {
      const localConversationsIds = localStorage.getItem(
        "hermine_conversation_ids"
      );
      if (localConversationsIds) {
        return JSON.parse(localConversationsIds)[0];
      }
      const response = await createConversation(
        settings.accountId,
        settings.agentSlug,
        settings.target,
        createFetchConfig(settings.agentSlug, settings.accountId)
      );
      return response;
    };

    const getSubscription = async () => {
      const newConversationId = await getConversationId();
      setConversationId(newConversationId);
      subscribeChannel(newConversationId, settings.target, onNewMessage);
    };
    if (toggled) {
      getSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggled, settings.target]);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);
  const { isMobile } = useResponsive();

  const mobileContainerStyle = {
    ...(settings.fontFamily ? { fontFamily: settings.fontFamily } : {}),
    justifyContent: location === "top" ? "start" : "end",
    height: "-webkit-fill-available",
    maxHeight: "100vh",
    maxWidth: "100vw",
  };

  const mobileStyle = {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
  };

  const getCssString = (value: string | number | undefined) => {
    if (value) {
      if (typeof value == "string") {
        return value;
      } else if (typeof value == "number") {
        return `${settings.spacingTop}px`;
      }
    }
    return "0px";
  };

  const containerStyle = {
    ...(settings.spacingTop ? { marginTop: settings.spacingTop } : {}),
    ...(settings.spacingBottom ? { marginBottom: settings.spacingBottom } : {}),
    ...(settings.spacingRight ? { marginRight: settings.spacingRight } : {}),
    ...(settings.fontFamily ? { fontFamily: settings.fontFamily } : {}),
    maxHeight: `calc(100vh - ${getCssString(
      settings.spacingTop
    )} - ${getCssString(settings.spacingBottom)} - 10px)`,
    maxWidth: `calc(100vw - ${getCssString(
      settings.spacingRight
    )} - ${getCssString(settings.spacingRight)})`,
  };

  const style = {};

  // Determine button size from props or settings
  const buttonWidth = propButtonWidth || settings.floatingButtonWidth;
  const buttonHeight = propButtonHeight || settings.floatingButtonHeight;

  useEffect(() => {
    const foundElements = document.getElementsByClassName(
      "hermine-chat-opener"
    );
    for (var i = 0; i < foundElements.length; i++) {
      const item = foundElements[i];
      item.addEventListener("click", open);
    }
  }, []);

  useEffect(() => {
    const foundElements = document.getElementsByClassName(
      "hermine-chat-toggler"
    );
    for (var i = 0; i < foundElements.length; i++) {
      const item = foundElements[i];
      item.addEventListener("click", toggleContainer);
    }
  }, []);

  const toggleContainer = () => setToggled((t) => !t);

  const open = () => setToggled(true);

  const close = () => setToggled(false);

  return (
    <div
      style={isMobile ? mobileContainerStyle : containerStyle}
      className={cx(
        styles.floatingContainer,
        styles[`floatingContainer-${location as Location}`]
      )}
    >
      {toggled && <ChatWindow close={close} />}
      <FloatingButton
        style={isMobile ? mobileStyle : style}
        setToggled={setToggled}
        width={buttonWidth}
        height={buttonHeight}
        imageUrl={conversation?.imageUrl}
      />
    </div>
  );
};

export default FloatingContainer;
