import consumer from "../consumer";

export const subscribeChannel = (
  conversationId: string,
  receiced: (data: any) => void,
) => {
  return consumer.subscriptions.create(
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
