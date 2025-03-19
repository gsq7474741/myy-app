import { fetchEventSource } from "@microsoft/fetch-event-source";

const getDifyHeader = () => {
  return {
    "content-type": "application/json",
    Authorization: `Bearer ${process.env.TARO_APP_AI_API_KEY!}`,
  };
};
const getDifyUrl = () => {
  return `${process.env.TARO_APP_AI_API_BASE_URL!}/chat-messages`;
};

export class DifySseH5 {
  abortController: AbortController;
  constructor() {
    this.abortController = new AbortController();
  }
  start(
    body: Record<string, any>,
    onMessage: (message: Record<string, any>) => void,
    onEnd: () => void
  ) {
    this.stop();
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(body),
      headers: getDifyHeader(),
      signal: this.abortController?.signal,
    };
    fetchEventSource(getDifyUrl(), {
      ...fetchOptions,
      onmessage: (e) => {
        try {
          if (e.data && e.event !== "ping") {
            onMessage(JSON.parse(e.data));
          }
        } catch (err) {
          this.stop();
          onEnd();
          console.error(err, e);
        }
      },
      onclose: () => {
        onEnd();
      },
      onerror: (e) => {
        console.log(e);
        this.stop();
        onEnd();
        throw e;
      },
    });
  }
  stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = new AbortController();
    }
  }
}
