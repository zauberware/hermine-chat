import consumer from "../consumer";

export const subscribeChannel = (conversationId: string) => {
  return consumer.subscriptions.create(
    {
      channel: "ConversationChannel",
      conversation_id: conversationId,
    },
    {
      received: (data: any) => {
        console.log('[+]data: ', data);
      },
    },
  );
};
