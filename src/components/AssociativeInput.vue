<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: zhangguijun8
 * @Date: 2022-03-05 11:40:16
 * @LastEditors: zhangguijun8
 * @LastEditTime: 2022-03-05 18:21:08
-->
<script setup>
  import { ref } from 'vue'
  defineProps({
    value: Object,
    contactList: Array,
  })
  // const count = ref(0)
</script>

<template>
  <h1>{{ value }}</h1>
  <div 
    v-for="item in contactList" 
    :key="item.uid"
  >
    <div style="">
      {{item.value}}
    </div>
  </div>
</template>

<style scoped>
</style>
