import React, { createContext, useContext, useState } from "react";

export interface ISettings {
  agentSlug: string;
  accountId: string;
  location?: "center" | "bottom" | "top";
}

export interface IMessage {
  id: string;
  result: string;
  updated_at: string;
  message_type: "ai" | "user";
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
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
  conversationId?: string;
  setConversationId: React.Dispatch<React.SetStateAction<string | undefined>>;
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
  conversationId: getConversationId(),
  setSettings: () => undefined,
  setConversationId: () => undefined,
  setConversation: () => undefined,
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

  return (
    <SettingsContext.Provider
      value={{
        settings: stateSettings,
        setSettings,
        conversationId,
        setConversationId,
        conversation,
        setConversation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
