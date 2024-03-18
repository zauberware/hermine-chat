const BASE_URL = "http://localhost:3000";

const CONVERSATION_KEY = "hermine_conversation_ids";

export const resetLocalConversation = () =>
  localStorage.removeItem(CONVERSATION_KEY);

export const createConversation = async (
  accountId: string,
  agentSlug: string,
  fetchConfig: RequestInit,
) => {
  const url = `${BASE_URL}/c/${accountId}/${agentSlug}/new`;
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
  fetchConfig: RequestInit,
) => {
  const url = `${BASE_URL}/conversations/${conversationId}/messages`;
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
  fetchConfig: RequestInit,
) => {
  const url = `${BASE_URL}/conversations/${conversationId}`;
  const response = await fetch(url, { ...fetchConfig, cache: "no-cache" });
  return await response.json();
};
