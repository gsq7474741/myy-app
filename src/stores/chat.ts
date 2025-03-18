import { defineStore } from "pinia";

export enum AiMessageSender {
  myy,
  me,
}

export type AiMessageItem = {
  time: number;
  sender: AiMessageSender;
  content: string;
};

export const useChatStore = defineStore("chat", () => {
  const messages = reactive<AiMessageItem[]>([]);

  const addMessage = (message: AiMessageItem) => {
    messages.push(message);
  };

  const push = (content: string) => {
    addMessage({
      time: new Date().getTime(),
      sender: AiMessageSender.me,
      content,
    });
  };

  return { messages, addMessage, push };
});
