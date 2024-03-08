import React, { useEffect, useState } from "react";
import "./FloatingContainer.css";
import { FloatingContainerProps } from "./FloatingContainer.types";
import ChatWindow from "../chatWindow";
import { createFetchConfig, getTheme } from "../../utils";
import FloatingButton from "../floatingButton/FloatingButton";
import { subscribeChannel } from "../../utils/channels/conversation_channel";
import { IConversation, useSettings } from "../../context";
import { createConversation, getConversation } from "../../api";

const FloatingContainer: React.FC<FloatingContainerProps> = () => {
  const [toggled, setToggled] = useState<boolean>(false);
  const [theme, setTheme] = useState<any>();

  const { settings, conversationId, setConversationId, setConversation } =
    useSettings();

  console.log("toggled", toggled);
  useEffect(() => {
    const fetchTheme = async () => {
      const newTheme = await getTheme(settings.agentSlug, settings.accountId);
      setTheme(newTheme);
    };

    fetchTheme();
  }, []);

  useEffect(() => {
    const getConversationId = async () => {
      console.log("getting converstaion id...");
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
      console.log("newConversationId", newConversationId);
      setConversationId(newConversationId);
      const channel = subscribeChannel(newConversationId);
      console.log("channel", channel);
    };
    if (toggled) {
      console.log("toggled", toggled);
      getSubscription();
    }
  }, [toggled]);

  useEffect(() => {
    const fetchConversation = async (id: string) => {
      const conversation = await getConversation(
        id,
        createFetchConfig(settings.agentSlug, settings.accountId),
      );
      setConversation(conversation as IConversation);
      console.log("conversation", conversation);
    };
    console.log("conversationId", conversationId);
    if (conversationId) {
      fetchConversation(conversationId);
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
