import React, { createContext, useContext, useState } from "react";

export interface ISettings {
  agentSlug: string;
  accountId: string;
  location?: "center" | "bottom" | "top";
}

export interface SettingsProps {
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
  conversationId: getConversationId(),
  setSettings: () => undefined,
  setConversationId: () => undefined,
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
  const [conversationId, setConversationId] = useState<string | undefined>(
    defaultSettings.conversationId,
  );
  const [stateSettings, setSettings] = useState<ISettings>(settings);

  return (
    <SettingsContext.Provider
      value={{
        settings: stateSettings,
        setSettings,
        conversationId,
        setConversationId,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
