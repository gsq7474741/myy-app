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
            ]
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
          @click="navigateBack({ delta: 1 })"
        ></view>
        <text :class="cn('font-bold')">木易养</text>
      </view>
      <view></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { usePageScroll, getCurrentPages, navigateBack } from "@tarojs/taro";

defineProps<{
  withAutoShadow?: boolean;
  withAutoBackground?: boolean;
  withAutoForeground?: boolean;
  showBack?: boolean;
}>();

const canBack = ref(false);

const isScrollTop = ref(true);
usePageScroll((res) => {
  isScrollTop.value = res.scrollTop < 1;
});

const checkCanBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    canBack.value = true;
  } else {
    canBack.value = false;
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
