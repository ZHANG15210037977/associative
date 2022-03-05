<!--
 * @Description:
 * @Version: 1.0
 * @Autor: zhangguijun8
 * @Date: 2022-03-05 11:40:16
 * @LastEditors: zhangguijun8
 * @LastEditTime: 2022-03-05 18:20:26
-->
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import AssociativeInput from './components/AssociativeInput.vue';
import icon1 from '../public/img/1.jpeg'
import icon2 from '../public/img/2.jpg'
import icon3 from '../public/img/3.jpg'

const contactList = [
  {
    value: '张桂军',
    uid: 1,
    iconUrl: icon1,
  },
  {
    value: '崔亮',
    uid: 2,
    iconUrl: icon2,
  },
  {
    value: '赵旭',
    uid: 3,
    iconUrl: icon3,
  },
  {
    value: '李龙',
    uid: 4,
    iconUrl: icon1,
  },
]
</script>

<template>
  <AssociativeInput
    msg="Hello Vue 3 + Vite"
    :contactList="contactList"
  />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
