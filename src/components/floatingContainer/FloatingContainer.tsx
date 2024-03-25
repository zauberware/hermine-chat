import React, { useEffect, useState } from "react";
import "./FloatingContainer.css";
import { FloatingContainerProps } from "./FloatingContainer.types";
import ChatWindow from "../chatWindow";
import { createFetchConfig } from "../../utils";
import FloatingButton from "../floatingButton/FloatingButton";
import { subscribeChannel } from "../../utils/channels/conversation_channel";
import { useSettings } from "../../context";
import { createConversation, getTheme } from "../../api";

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
  }, []);

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
  }, [toggled]);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);
  const style = {
    ...(settings.spacingTop ? { marginTop: settings.spacingTop } : {}),
    ...(settings.spacingBottom ? { marginBottom: settings.spacingBottom } : {}),
    ...(settings.spacingRight ? { marginRight: settings.spacingRight } : {}),
  };

  const close = () => setToggled(false);

  return (
    <div
      style={style}
      className={`floating-container floating-container-${settings.location}`}
    >
      {toggled && <ChatWindow close={close} theme={theme} />}
      <FloatingButton setToggled={setToggled} />
    </div>
  );
};

export default FloatingContainer;
