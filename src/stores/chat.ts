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
  const messages = reactive<AiMessageItem[]>([
    {
      time: 1631142400000,
      sender: AiMessageSender.myy,
      content: "你好，我是木小易，很高兴为您服务。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
    {
      time: 1631142400000,
      sender: AiMessageSender.me,
      content: "你好，很高兴认识你。",
    },
  ]);

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
