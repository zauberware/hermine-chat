const BASE_URL = "http://localhost:3000";

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
  const localConversationIdsString = localStorage.getItem(
    "hermine_conversation_ids",
  );
  if (localConversationIdsString) {
    const localConversationIds = JSON.parse(localConversationIdsString);
    const newLocalConversationIds = [
      jsonText.conversation_id,
      ...localConversationIds,
    ];
    localStorage.setItem(
      "hermine_conversation_ids",
      JSON.stringify(newLocalConversationIds),
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
