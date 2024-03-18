import React, { createContext, useContext, useState } from "react";
import { getConversation, resetLocalConversation } from "../api";
import { createFetchConfig, ITheme } from "../utils";

export interface ISettings {
  agentSlug: string;
  accountId: string;
  chatTitle?: string;
  spacingBottom?: string;
  spacingTop?: string;
  spacingRight?: string;
  buttonColor?: string;
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
}

export interface IConversation {
  id?: string;
  messages: IMessage[];
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
  fetchConversation: () => void;
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
    setConversationId(undefined);
    setTimeout(() => getConversationId(), 1000);
  };

  const fetchConversation = async () => {
    if (conversationId) {
      const conversation = await getConversation(
        conversationId,
        createFetchConfig(settings.agentSlug, settings.accountId),
      );
      setConversation(conversation as IConversation);
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
