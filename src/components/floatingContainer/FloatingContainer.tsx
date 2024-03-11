import React, { useEffect, useState } from "react";
import "./FloatingContainer.css";
import { FloatingContainerProps } from "./FloatingContainer.types";
import ChatWindow from "../chatWindow";
import { createFetchConfig, getTheme } from "../../utils";
import FloatingButton from "../floatingButton/FloatingButton";
import { subscribeChannel } from "../../utils/channels/conversation_channel";
import { useSettings } from "../../context";
import { createConversation } from "../../api";

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
      const newTheme = await getTheme(settings.agentSlug, settings.accountId);
      setTheme(newTheme);
    };

    fetchTheme();
  }, []);

  const onNewMessage = (data: any) => {
    console.log("new message received: ", data);
    fetchConversation();
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
        createFetchConfig(settings.agentSlug, settings.accountId),
      );
      return response;
    };

    const getSubscription = async () => {
      const newConversationId = await getConversationId();
      setConversationId(newConversationId);
      const channel = subscribeChannel(newConversationId, onNewMessage);
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

  return (
    <div
      className={`floating-container floating-container-${settings.location}`}
    >
      {toggled && <ChatWindow theme={theme} />}
      <FloatingButton setToggled={setToggled} />
    </div>
  );
};

export default FloatingContainer;
