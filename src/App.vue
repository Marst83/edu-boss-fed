<template>
  <div id="app">
    <h1 class="test1">1111</h1>
    <!-- 根路由出口 -->
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'App'
})
</script>

<style lang="scss" scoped>
.test1 {
  color: $success-color;
}
</style>
