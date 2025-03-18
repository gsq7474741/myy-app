<template>
  <view
    class="bg-[#F3F4F6] border border-[#EAEDF2] border-solid rounded-3xl w-full min-h-[1em] p-2.5"
  >
    <textarea
      v-model="inputValue"
      :focus="focus"
      class="bg-transparent w-full h-full chat-input-box text-base leading-[1.75] box-border"
      :auto-height="true"
      :auto-focusd="true"
      placeholder="请您随时提问"
      :maxlength="-1"
    />
    <view class="flex justify-end items-center w-full" @click="focus = true">
      <view
        :class="
          cn(
            'flex justify-center items-center size-[28px] rounded-full transition-colors',
            sendable ? 'bg-[#4D6BFE]' : 'bg-[#D6DEE8]'
          )
        "
        @click.stop="handleSend"
      >
        <view class="size-[16px] text-white i-myy-send"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// const props=defineProps<{}>()

const chatStore = useChatStore();
const inputValue = ref("");
const focus = ref(false);

const sendable = computed(() => inputValue.value.trim() !== "");

const handleSend = () => {
  if (!sendable.value) return;
  chatStore.push(inputValue.value);
  inputValue.value = "";
};
</script>

<style>
.chat-input-box {
  .taro-textarea {
    background: transparent;
    min-height: 6ex;
  }
}
</style>
