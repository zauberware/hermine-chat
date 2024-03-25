import React, { createContext, useContext, useEffect, useState } from "react";
import { getConversation, resetLocalConversation, ITheme } from "../api";
import { createFetchConfig } from "../utils";

export interface ISettings {
  agentSlug: string;
  accountId: string;
  chatTitle?: string;
  spacingBottom?: string;
  spacingTop?: string;
  spacingRight?: string;
  buttonColor?: string;
  target?: string;
  floatingButtonBorderColor?: string;
  buttonBackgroundColor?: string;
  userMessageColor?: string;
  userMessageBackgroundColor?: string;
  location?: "center" | "bottom" | "top";
}

export interface IMessage {
  result: string;
  message_type: "user" | "ai";
  conversation_id: string;
  id: string;
  updated_at: string;
  has_errors: boolean;
}

export interface IConversation {
  id?: string;
  messages: IMessage[];
  privacyDisclaimer?: any;
}

export interface SettingsProps {
  conversation?: IConversation;
  setConversation: React.Dispatch<
    React.SetStateAction<IConversation | undefined>
  >;
  theme: ITheme;
  setTheme: React.Dispatch<React.SetStateAction<ITheme>>;
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
  conversationId?: string;
  setConversationId: React.Dispatch<React.SetStateAction<string | undefined>>;
  fetchConversation: (message?: any) => void;
  resetConversation: () => void;
}

const getConversationId = () => {
  const localConversationIdsString = localStorage.getItem(
    "hermine_conversation_ids",
  );
  if (localConversationIdsString) {
    const localConversationIds = JSON.parse(localConversationIdsString);
    return localConversationIds[0];
  } else {
    return undefined;
  }
};

export const defaultSettings: SettingsProps = {
  settings: {
    agentSlug: "",
    accountId: "",
    location: "bottom",
  },
  conversation: {
    messages: [],
  },
  theme: {},
  setTheme: () => undefined,
  conversationId: getConversationId(),
  setSettings: () => undefined,
  setConversationId: () => undefined,
  setConversation: () => undefined,
  fetchConversation: () => undefined,
  resetConversation: () => undefined,
};

export const SettingsContext = createContext(defaultSettings);

export const useSettings = () => {
  return useContext(SettingsContext);
};

interface SettingsContextProviderProps extends React.PropsWithChildren {
  settings: ISettings;
}

const SettingsContextProvider = ({
  children,
  settings,
}: SettingsContextProviderProps) => {
  const [conversation, setConversation] = useState<IConversation | undefined>(
    defaultSettings.conversation,
  );
  const [conversationId, setConversationId] = useState<string | undefined>(
    getConversationId(),
  );
  const [stateSettings, setSettings] = useState<ISettings>(settings);
  const [theme, setTheme] = useState<ITheme>(defaultSettings.theme);

  const resetConversation = () => {
    resetLocalConversation();
    setConversation(undefined);
    setConversationId(undefined);
    setTimeout(() => getConversationId(), 1000);
  };

  useEffect(() => {
    checkAndRefetchConversation();
  }, [conversation?.messages]);

  const checkAndRefetchConversation = () => {
    if (conversation?.messages) {
      const lastAIMessage = conversation.messages
        ?.reverse()
        ?.find((m) => m.message_type === "ai");
      console.debug("lastAIMessage", lastAIMessage);
      if (lastAIMessage?.result === "..." && !lastAIMessage?.has_errors) {
        setTimeout(() => {
          console.debug("[*] refetching in 2000ms ...");
          fetchConversation(lastAIMessage);
        }, 2000);
      }
    }
  };

  const fetchConversation = async (message?: any) => {
    if (conversationId) {
      const conversation = await getConversation(
        conversationId,
        stateSettings.target,
        createFetchConfig(stateSettings.agentSlug, stateSettings.accountId),
      );
      setConversation(conversation as IConversation);
      console.debug("message", message);
      if (message?.result === "..." || message?.result === null) {
        checkAndRefetchConversation();
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        settings: stateSettings,
        setSettings,
        conversationId,
        setConversationId,
        conversation,
        setConversation,
        fetchConversation,
        resetConversation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
