import consumer from "../consumer";

const DEFAULT_BASE_URL = "https://hermine.ai";

export const subscribeChannel = (
  conversationId: string,
  baseUrl: string = DEFAULT_BASE_URL,
  receiced: (data: any) => void,
) => {
  return consumer(baseUrl).subscriptions.create(
    {
      channel: "ChatbotChannel",
      conversation_id: conversationId,
    },
    {
      received: (data: any) => {
        console.debug(`[+] data received: , ${JSON.stringify(data)}`);
        receiced(data);
      },
    },
  );
};
