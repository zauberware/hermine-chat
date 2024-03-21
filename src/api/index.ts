import { createFetchConfig } from "../utils";

export interface ITheme {
  ai_icon?: string;
  logo?: string;
  logo_small?: string;
  backgroundColor?: string;
  primary_900?: string;
  primary_800?: string;
  primary_700?: string;
  primary_600?: string;
  primary_500?: string;
  primary_400?: string;
  primary_300?: string;
  primary_200?: string;
  primary_100?: string;
  primary_50?: string;
  name?: string;
}

const DEFAULT_BASE_URL = "https://hermine.ai";

const CONVERSATION_KEY = "hermine_conversation_ids";

export const resetLocalConversation = () =>
  localStorage.removeItem(CONVERSATION_KEY);

export const createConversation = async (
  accountId: string,
  agentSlug: string,
  baseUrl: string = DEFAULT_BASE_URL,
  fetchConfig: RequestInit,
) => {
  const url = `${baseUrl}/c/${accountId}/${agentSlug}/new`;
  const response = await fetch(url, {
    ...fetchConfig,
  });

  const jsonText = await response.json();
  const localConversationIdsString = localStorage.getItem(CONVERSATION_KEY);
  if (localConversationIdsString) {
    const localConversationIds = JSON.parse(localConversationIdsString);
    const newLocalConversationIds = [
      jsonText.conversation_id,
      ...localConversationIds,
    ];
    localStorage.setItem(
      CONVERSATION_KEY,
      JSON.stringify(newLocalConversationIds),
    );
  } else {
    localStorage.setItem(
      CONVERSATION_KEY,
      JSON.stringify([jsonText.conversation_id]),
    );
  }
  return jsonText.conversation_id;
};

export const sendMessage = async (
  message: any,
  conversationId: string,
  baseUrl: string = DEFAULT_BASE_URL,
  fetchConfig: RequestInit,
) => {
  const url = `${baseUrl}/conversations/${conversationId}/messages`;
  const response = await fetch(url, {
    ...fetchConfig,
    body: JSON.stringify({
      message: {
        result: message,
      },
    }),
  });
  return response.text;
};

export const getConversation = async (
  conversationId: string,
  baseUrl: string = DEFAULT_BASE_URL,
  fetchConfig: RequestInit,
) => {
  const url = `${baseUrl}/conversations/${conversationId}`;
  const response = await fetch(url, { ...fetchConfig, cache: "no-cache" });
  return await response.json();
};

export const getTheme = async (
  agentSlug: string,
  accountId: string,
  baseUrl: string = DEFAULT_BASE_URL,
): Promise<ITheme> => {
  const fetchConfig = createFetchConfig(agentSlug, accountId);
  console.debug("fetchConfig", fetchConfig);
  // TODO: change route
  const response = await fetch(
    `http://${baseUrl}/api/v1/account_theme`,
    fetchConfig,
  );
  const json = await response.json();
  console.debug("response json: ", json);
  return json || {};
};
