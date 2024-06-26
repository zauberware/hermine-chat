import { IMessage } from "../../context";

export interface ChatMessageProps {
  message: IMessage;
  tryAgain(id: string): void
}
