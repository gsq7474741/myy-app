<template>
  <view
    :class="
      cn(
        'rounded-full h-11.25 w-22 transition-colors relative p-0.5',
        modelValue ? 'bg-[#2795EF]' : 'bg-[#C7CED1]',
        props.class
      )
    "
    @click="switchValue"
  >
    <view
      :class="
        cn(
          'absolute rounded-full size-10.25 top-0.5 thumb transition-all flex items-center justify-center',
          modelValue ? 'left-11.5' : 'left-0.5'
        )
      "
    >
      <image
        v-if="thumbImage"
        :src="thumbImage"
        class="size-[80%] flex items-center justify-center"
        mode="aspectFit"
      ></image>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ClassValue } from "clsx";

const props = defineProps<{ class?: ClassValue; thumbImage?: string }>();
const modelValue = defineModel<boolean>({ default: false });

const switchValue = () => {
  modelValue.value = !modelValue.value;
};
</script>

<style scoped>
.thumb {
  background: radial-gradient(
    50% 50% at 50% 50%,
    #ffffff 0%,
    #ffffff 43.5%,
    #e6f2fc 87%,
    #e4f1fb 100%
  );
}
</style>
