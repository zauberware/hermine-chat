export interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  conversationId: string;
  onSubmitFeedback: (messageId: string, conversationId: string, feedback: string) => Promise<boolean>;
}
