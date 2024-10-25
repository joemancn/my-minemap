<template>
  <div class="app">
    <MyMinemap></MyMinemap>
  </div>

</template>

<script setup>
import { MyMinemap } from '@/my-minemap'; // 单独导入
// import Test from './components/Test.vue';

</script>

<style lang="scss" scoped>
.app {
  height: 100vh;
  width: 100vw;
}
</style>

<style lang="scss">// 必须引入样式
@import url('@/my-minemap/style');
</style>
