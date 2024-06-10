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

export interface IConversation {
  messages: any[]
  prompts: string[]
  conversationId: string
  inputPlaceholderDe?: string
  inputPlaceholderEn?: string
}

const DEFAULT_BASE_URL = "https://hermine.ai";

const CONVERSATION_KEY = "hermine_conversation_ids";

export const resetLocalConversation = () =>
  localStorage.removeItem(CONVERSATION_KEY);

export const createConversation: (accountId: string, agentSlug: string, baseUrl?: string, fetchConfig?: RequestInit) => Promise<string> = async (
  accountId,
  agentSlug,
  baseUrl = DEFAULT_BASE_URL,
  fetchConfig,
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
  return jsonText.conversation_id as string;
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

export const retry = async (
  messageId: any,
  baseUrl: string = DEFAULT_BASE_URL,
  fetchConfig: RequestInit,
) => {
  const url = `${baseUrl}/chat/conversations/${messageId}/rerun`;
  const response = await fetch(url, {
    ...fetchConfig,
  });
  return response.text;
};

const getHeaders = (headers: any) => {
  let headerObj: any = {};
  const keys = headers.keys();
  let header = keys.next();
  while (header.value) {
    headerObj[header.value] = headers.get(header.value);
    header = keys.next();
  }
  return headerObj;
};

export const getConversation: (conversationId: string, baseUrl?: string, fetchConfig?: any) => Promise<IConversation | undefined> = async (
  conversationId,
  baseUrl = DEFAULT_BASE_URL,
  fetchConfig,
) => {
  const url = `${baseUrl}/chat/conversations/${conversationId}`;
  const response = await fetch(url, { ...fetchConfig, cache: "no-cache" });
  const headers = getHeaders(fetchConfig.headers)
  if (response.status === 200) {
    return await response.json() as IConversation;
  } else {
    createConversation(
      headers['x-account-id'],
      headers['x-agent-slug'],
      baseUrl,
      fetchConfig
    )
  }
};

export const getTheme = async (
  agentSlug: string,
  accountId: string,
  baseUrl: string = DEFAULT_BASE_URL,
): Promise<ITheme> => {
  const fetchConfig = createFetchConfig(agentSlug, accountId);
  const response = await fetch(`${baseUrl}/chat/account_theme`, fetchConfig);
  const json = await response.json();
  console.debug("response json: ", json);
  return json || {};
};
