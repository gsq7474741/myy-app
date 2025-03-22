import { defineStore } from "pinia";
import { DifySseH5 } from "../api/index";
import Taro from "@tarojs/taro";

export enum AiMessageSender {
  myy,
  me,
}

export type AiMessageItem = {
  time: number;
  sender: AiMessageSender;
  content: string;
  loading: boolean;
  id?: string;
  [key: string]: any;
};

export const useChatStore = defineStore("chat", () => {
  const messages = reactive<AiMessageItem[]>([]);
  const sendable = ref(true);
  const lastMeMessageIndex = ref(-1);
  // const lastMeMessage = computed(() => {
  //   return messages[lastMeMessageIndex.value];
  // });
  const conversationId = ref("");
  const lastAiMessageIndex = ref(-1);
  const lastAiMessage = computed(() => {
    return messages[lastAiMessageIndex.value];
  });
  const addMessage = (message: AiMessageItem) => {
    messages.push(message);
    const index = messages.length - 1;
    if (message.sender === AiMessageSender.me) {
      lastMeMessageIndex.value = index;
    } else if (message.sender === AiMessageSender.myy) {
      lastAiMessageIndex.value = index;
    }
  };

  const sseH5 = new DifySseH5();

  const processMessage = (message: any) => {
    const event = message.event;
    if (event === "workflow_started") {
      addMessage({
        time: message.created_at,
        sender: AiMessageSender.myy,
        content: "",
        id: message.message_id,
        loading: true,
      });
      conversationId.value = message.conversation_id;
    } else if (event === "message") {
      if (message.message_id === lastAiMessage.value.id) {
        lastAiMessage.value.content += message.answer;
      }
    } else if (event === "message_end") {
      lastAiMessage.value.loading = false;
      sseH5.stop();
      sendable.value = true;
    }
  };
  const push = (content: string) => {
    sendable.value = false;
    addMessage({
      time: new Date().getTime() / 1000,
      sender: AiMessageSender.me,
      content,
      loading: false,
    });

    try {
      sseH5.start(
        {
          query: content,
          inputs: {},
          response_mode: "streaming",
          user: "test",
          conversation_id: conversationId.value,
        },
        processMessage,
        () => {
          lastAiMessage.value.loading = false;
          sendable.value = true;
        }
      );
    } catch {
      Taro.showToast({ title: "网络错误", icon: "error" });
      lastAiMessage.value.loading = false;
      sendable.value = true;
    }
  };

  return { messages, addMessage, push, sendable };
});
