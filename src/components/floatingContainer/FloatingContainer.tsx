import React, { useEffect, useState } from "react";
import cx from 'classnames'
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

const FloatingContainer: React.FC<FloatingContainerProps> = () => {
  const [toggled, setToggled] = useState<boolean>(false);

  const {
    theme,
    setTheme,
    settings,
    conversationId,
    setConversationId,
    fetchConversation,
  } = useSettings();

  const { location } = settings

  useEffect(() => {
    const fetchTheme = async () => {
      const newTheme = await getTheme(
        settings.agentSlug,
        settings.accountId,
        settings.target,
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
        "hermine_conversation_ids",
      );
      if (localConversationsIds) {
        return JSON.parse(localConversationsIds)[0];
      }
      const response = await createConversation(
        settings.accountId,
        settings.agentSlug,
        settings.target,
        createFetchConfig(settings.agentSlug, settings.accountId),
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
  }, [toggled, settings.target]);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);
  const { isMobile } = useResponsive();

  const mobileStyle = {
    ...(settings.fontFamily ? { fontFamily: settings.fontFamily } : {}),
  }

  const style = {
    ...(settings.spacingTop ? { marginTop: settings.spacingTop } : {}),
    ...(settings.spacingBottom ? { marginBottom: settings.spacingBottom } : {}),
    ...(settings.spacingRight ? { marginRight: settings.spacingRight } : {}),
    ...(settings.fontFamily ? { fontFamily: settings.fontFamily } : {}),
  };

  useEffect(() => {
    const foundElements = document.getElementsByClassName('hermine-chat-opener')
    for (var i = 0; i < foundElements.length; i++) {
      const item = foundElements[i]
      item.addEventListener('click', open)
    }
  }, [])

  useEffect(() => {
    const foundElements = document.getElementsByClassName('hermine-chat-toggler')
    for (var i = 0; i < foundElements.length; i++) {
      const item = foundElements[i]
      item.addEventListener('click', toggleContainer)
    }
  }, [])

  const toggleContainer = () => setToggled(t => !t)

  const open = () => setToggled(true)

  const close = () => setToggled(false);

  return (
    <div
      style={isMobile ? mobileStyle : style}
      className={cx(styles.floatingContainer, styles[`floatingContainer-${location as Location}`])}
    >
      {toggled && <ChatWindow close={close} theme={theme} />}
      <FloatingButton setToggled={setToggled} />
    </div>
  );
};

export default FloatingContainer;
