<template>
  <view
    :class="
      cn(
        'navbar h-[56px] w-full fixed top-0 z-10 px-4',
        isScrollTop
          ? 'bg-transparent navbar-top'
          : [
              withAutoBackground && 'bg-white',
              withAutoShadow && 'navbar-scrolled',
            ],
        props.class
      )
    "
  >
    <view class="flex items-center justify-between h-full">
      <view
        :class="
          cn(
            'flex items-center gap-2',
            withAutoForeground && [isScrollTop ? 'text-white' : 'text-[#666]']
          )
        "
      >
        <view
          v-if="showBack && canBack"
          class="size-[24px] i-myy-back"
          @click="onClickBack"
        ></view>
        <text :class="cn('font-bold')">{{ title || "木易养" }}</text>
      </view>
      <view>
        <template v-if="rightHandler && rightText">
          <view
            class="flex items-center gap-2 text-sm text-white bg-green rounded-lg py-1.5 px-4 hover:bg-op-80"
            @click="rightHandler"
            >提交</view
          >
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { usePageScroll, getCurrentPages, navigateBack } from "@tarojs/taro";
import { ClassValue } from "clsx";

const props = defineProps<{
  withAutoShadow?: boolean;
  withAutoBackground?: boolean;
  withAutoForeground?: boolean;
  showBack?: boolean;
  title?: string;
  back?: () => void;
  class?: ClassValue;
  rightText?: string;
  rightHandler?: () => void;
}>();

const canBack = ref(false);

const isScrollTop = ref(true);
usePageScroll((res) => {
  isScrollTop.value = res.scrollTop < 1;
});

const checkCanBack = () => {
  if (props.back) {
    canBack.value = true;
    return;
  }
  const pages = getCurrentPages();
  if (pages.length > 1) {
    canBack.value = true;
  } else {
    canBack.value = false;
  }
};

const onClickBack = () => {
  if (props.back) {
    props.back();
  } else {
    navigateBack({ delta: 1 });
  }
};

onMounted(() => {
  checkCanBack();
});

onUnmounted(() => {
  canBack.value = false;
});
</script>

<style scoped>
.navbar-scrolled {
  box-shadow: 0 1px 7px 0 #edeef1;
}
</style>
