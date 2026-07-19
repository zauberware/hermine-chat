import { createFetchConfig } from "../utils";

export interface ITheme {
  ai_icon?: string;
  logo?: string;
  logo_small?: string;
  logo_is_square?: boolean;
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
  messages: any[];
  prompts: string[];
  conversationId: string;
  inputPlaceholderDe?: string;
  inputPlaceholderEn?: string;
  imageUrl?: string;
  ownershipToken?: string;
}

const DEFAULT_BASE_URL = "https://hermine.ai";

const CONVERSATION_KEY = "hermine_conversation_ids";
// GDPR ownership tokens (map conversationId -> signed token). The token is
// issued by the backend and authorizes export (Art. 15) and deletion
// (Art. 17) of the visitor's own conversation.
const TOKEN_KEY = "hermine_conversation_tokens";

export const resetLocalConversation = () => {
  localStorage.removeItem(CONVERSATION_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

const readTokenMap = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}");
  } catch (e) {
    return {};
  }
};

export const storeOwnershipToken = (conversationId: string, token?: string) => {
  if (!conversationId || !token) return;
  const tokens = readTokenMap();
  tokens[conversationId] = token;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const getOwnershipToken = (conversationId?: string): string | undefined =>
  conversationId ? readTokenMap()[conversationId] : undefined;

// Remove one conversation (and its token) from local storage, e.g. after the
// visitor permanently deleted it on the server.
export const removeLocalConversation = (conversationId: string) => {
  const localConversationIdsString = localStorage.getItem(CONVERSATION_KEY);
  if (localConversationIdsString) {
    try {
      const ids = JSON.parse(localConversationIdsString).filter(
        (id: string) => id !== conversationId
      );
      localStorage.setItem(CONVERSATION_KEY, JSON.stringify(ids));
    } catch (e) {
      localStorage.removeItem(CONVERSATION_KEY);
    }
  }
  const tokens = readTokenMap();
  delete tokens[conversationId];
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const createConversation: (
  accountId: string,
  agentSlug: string,
  baseUrl?: string,
  fetchConfig?: RequestInit
) => Promise<string> = async (
  accountId,
  agentSlug,
  baseUrl = DEFAULT_BASE_URL,
  fetchConfig
) => {
  const url = `${baseUrl}/c/${accountId}/${agentSlug}/new`;
  const response = await fetch(url, {
    ...fetchConfig,
  });

  // A non-public agent redirects this request to the login page (HTML), which
  // used to crash the JSON parse and silently kill the widget. Fail loud.
  if (!response.ok) {
    console.error(
      `HermineChat: could not create a conversation (HTTP ${response.status}). ` +
        "Check that the agent is publicly accessible."
    );
    return undefined as unknown as string;
  }

  const jsonText = await response.json();
  storeOwnershipToken(jsonText.conversation_id, jsonText.ownership_token);
  const localConversationIdsString = localStorage.getItem(CONVERSATION_KEY);
  if (localConversationIdsString) {
    const localConversationIds = JSON.parse(localConversationIdsString);
    const newLocalConversationIds = [
      jsonText.conversation_id,
      ...localConversationIds,
    ];
    localStorage.setItem(
      CONVERSATION_KEY,
      JSON.stringify(newLocalConversationIds)
    );
  } else {
    localStorage.setItem(
      CONVERSATION_KEY,
      JSON.stringify([jsonText.conversation_id])
    );
  }
  return jsonText.conversation_id as string;
};

export const sendMessage = async (
  message: any,
  conversationId: string,
  baseUrl: string = DEFAULT_BASE_URL,
  fetchConfig: RequestInit
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
  fetchConfig: RequestInit
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

// Low-level load of a single conversation by id. Returns the parsed
// conversation on HTTP 200, or undefined on any non-200 (gone / not
// accessible). No side effects — the healing/creation logic lives in
// getConversation so this can be reused for both the requested id and a
// freshly created one without risking a create loop.
const loadConversation = async (
  conversationId: string,
  baseUrl: string,
  fetchConfig: any
): Promise<IConversation | undefined> => {
  const url = `${baseUrl}/chat/conversations/${conversationId}`;
  const response = await fetch(url, { ...fetchConfig, cache: "no-cache" });
  if (response.status !== 200) return undefined;

  const conversation = (await response.json()) as IConversation;
  // Backend re-issues the GDPR ownership token on load so conversations
  // created before the token feature can also be exported/deleted.
  storeOwnershipToken(conversationId, conversation.ownershipToken);
  // Guarantee the returned object carries the id we loaded so callers can sync
  // their local state to it (important after healing a stale id).
  return { ...conversation, conversationId: conversation.conversationId || conversationId };
};

export const getConversation: (
  conversationId: string,
  baseUrl?: string,
  fetchConfig?: any
) => Promise<IConversation | undefined> = async (
  conversationId,
  baseUrl = DEFAULT_BASE_URL,
  fetchConfig
) => {
  const conversation = await loadConversation(conversationId, baseUrl, fetchConfig);
  if (conversation) return conversation;

  // The stored conversation is gone — deleted by the visitor, or expired /
  // anonymized by the retention crons — or otherwise no longer accessible.
  // Drop the dead id so we stop retrying it, then start a fresh conversation
  // and return it, so the widget self-heals instead of logging "Could not
  // fetch conversation" and spawning an orphan conversation on every retry.
  removeLocalConversation(conversationId);

  const headers = getHeaders(fetchConfig.headers);
  const newConversationId = await createConversation(
    headers["x-account-id"],
    headers["x-agent-slug"],
    baseUrl,
    fetchConfig
  );
  if (!newConversationId) return undefined;

  return loadConversation(newConversationId, baseUrl, fetchConfig);
};

export const getTheme = async (
  agentSlug: string,
  accountId: string,
  baseUrl: string = DEFAULT_BASE_URL
): Promise<ITheme> => {
  const fetchConfig = createFetchConfig(agentSlug, accountId);
  const response = await fetch(`${baseUrl}/chat/account_theme`, fetchConfig);
  const json = await response.json();
  console.debug("response json: ", json);
  return json || {};
};

export const submitMessageFeedback = async (
  conversationId: string,
  messageId: string,
  feedback: string,
  agentSlug: string,
  accountId: string,
  baseUrl: string = DEFAULT_BASE_URL
): Promise<any> => {
  const fetchConfig = createFetchConfig(agentSlug, accountId);
  
  console.log("Sending feedback request:", {
    url: `${baseUrl}/chat/conversations/${conversationId}/messages/${messageId}/feedback`,
    headers: fetchConfig.headers,
    body: { message: { feedback } }
  });

  const response = await fetch(
    `${baseUrl}/chat/conversations/${conversationId}/messages/${messageId}/feedback`,
    {
      ...fetchConfig,
      method: "POST",
      body: JSON.stringify({
        message: {
          feedback: feedback,
        },
      }),
    }
  );

  console.log("Feedback response status:", response.status, response.statusText);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Feedback request failed:", {
      status: response.status,
      statusText: response.statusText,
      body: errorBody
    });
    throw new Error(`Failed to submit feedback: ${response.statusText}`);
  }

  const responseData = await response.json();
  console.log("Feedback response data:", responseData);

  return responseData;
};

// fetchConfig.headers is a Headers instance (see createFetchConfig), so a
// plain object spread would silently drop all headers. Copy it properly.
const withOwnershipToken = (
  headers: HeadersInit | undefined,
  token: string
): Headers => {
  const merged = new Headers(headers);
  merged.set("X-Conversation-Token", token);
  return merged;
};

// GDPR Art. 15: download the visitor's own conversation data as JSON.
// Requires the ownership token stored for this conversation.
export const exportConversation = async (
  conversationId: string,
  baseUrl: string = DEFAULT_BASE_URL,
  fetchConfig: RequestInit = {}
): Promise<boolean> => {
  const token = getOwnershipToken(conversationId);
  if (!token) {
    console.error("HermineChat: no ownership token stored for this conversation.");
    return false;
  }

  const response = await fetch(
    `${baseUrl}/chat/conversations/${conversationId}/export`,
    {
      ...fetchConfig,
      method: "GET",
      headers: withOwnershipToken(fetchConfig.headers, token),
    }
  );

  if (!response.ok) {
    console.error(`HermineChat: data export failed (HTTP ${response.status}).`);
    return false;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `hermine-data-export-${conversationId}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return true;
};

// GDPR Art. 17: permanently delete the visitor's own conversation on the
// server (messages, files, analysis data) and clean up local storage.
export const deleteConversationRemote = async (
  conversationId: string,
  baseUrl: string = DEFAULT_BASE_URL,
  fetchConfig: RequestInit = {}
): Promise<boolean> => {
  const token = getOwnershipToken(conversationId);
  if (!token) {
    console.error("HermineChat: no ownership token stored for this conversation.");
    return false;
  }

  const response = await fetch(`${baseUrl}/chat/conversations/${conversationId}`, {
    ...fetchConfig,
    method: "DELETE",
    headers: withOwnershipToken(fetchConfig.headers, token),
  });

  if (!response.ok) {
    console.error(`HermineChat: conversation deletion failed (HTTP ${response.status}).`);
    return false;
  }

  removeLocalConversation(conversationId);
  return true;
};
