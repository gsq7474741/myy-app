<template>
  <AtNavBar @clickLeftIcon="onClickBack" color="#000" title="导航" />
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { AtNavBar } from "taro-ui-vue3";
const rect = Taro.getMenuButtonBoundingClientRect();

const onClickBack = () => {
  console.log(rect);
};
</script>
