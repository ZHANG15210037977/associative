<!--
 * @Description:
 * @Version: 1.0
 * @Autor: zhangguijun8
 * @Date: 2022-03-05 11:40:16
 * @LastEditors: zhangguijun8
 * @LastEditTime: 2022-03-07 21:06:50
-->
<script setup>
import { ref } from 'vue'
import AssociativeInput from './components/AssociativeInput.vue';
import icon1 from '../public/img/1.jpeg'
import icon2 from '../public/img/2.jpg'
import icon3 from '../public/img/3.jpg'

const contactList = ref([
  {
    label: '张桂军',
    value: 1,
    url: icon1,
  },
  {
    label: '崔亮',
    value: 2,
    url: icon2,
  },
  {
    label: '赵旭',
    value: 3,
    url: icon3,
  },
  {
    label: '李龙',
    value: 4,
    url: icon1,
  },
  {
    label: '无名',
    value: 5,
    url: icon2,
  },
  {
    label: '小灰灰',
    value: 6,
    url: icon3,
  },
])
const value = ref(null)

const associativeInputRef = ref(null)

const handleChangeValue = (val) => {
  value.value = val
}

const handleKeydown = (e) => {
  associativeInputRef?.value?.handleKeydown(e)
}
const handleInput = (e) => {
  associativeInputRef?.value?.handleInput(e)
}
const handleClick = (e) => {
  associativeInputRef?.value?.handleClick(e)
}

</script>

<template>
  <div class="associativeInput-wreap">
    <AssociativeInput
      v-slot="slot"
      ref="associativeInputRef"
      :value="value"
      :contactList="contactList"
      @change="handleChangeValue"
    >
      <el-input 
        v-model="slot.value"
        placeholder="请输入"
        type="textarea"
        :id="slot.id"
        @keydown="handleKeydown"
        @input="handleInput"
        @click="handleClick"
        @focus="handleClick"
        :rows="3"
      />
    </AssociativeInput>
  </div>
</template>

<style>
html{
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.associativeInput-wreap{
  padding: 100px;
}
</style>
