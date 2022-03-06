<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: zhangguijun8
 * @Date: 2022-03-05 11:40:16
 * @LastEditors: zhangguijun8
 * @LastEditTime: 2022-03-06 23:55:15
-->
<script setup>
  // import { ref } from 'vue'
  defineProps({
    contactList: Array,
    top: Number | String,
    left: Number | String,
  })
  const emits  = defineEmits(['click'])

  const handleOnClick = (value) => {
    emits('click', value)
  }
</script>

<template>
  <el-card
    ref="contactWrepRef"
    class="pg-contact-select"
    :style="{
      top,
      left,
    }"
  >
    <el-row 
      class="contact-row"
      v-for="item in contactList" 
      align="middle"
      :gutter="20"
      :key="item.value"
      @click="() => handleOnClick(item.value)"
    >
      <el-col span="8">
        <el-avatar 
          :size="30" 
          :src="item.url"
        />
      </el-col>
      <el-col 
        class="contact-row-label"
        span="16"
      >
        {{item.label}}
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.pg-contact-select{
  width: 200px;
  max-height: 220px;
  position: fixed;
  overflow-y: scroll;
}
.contact-row{
  margin-top: 10px;
}
.contact-row:hover{
  background-color: var(--el-bg-color);
  cursor: pointer;
}
.contact-row-label{
  max-width: 60%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
</style>
