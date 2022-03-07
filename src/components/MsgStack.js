/*
 * @Description: 
 * @Version: 1.0
 * @Autor: zhangguijun8
 * @Date: 2022-03-07 09:50:25
 * @LastEditors: zhangguijun8
 * @LastEditTime: 2022-03-07 20:55:34
 */
import { ref, computed } from 'vue'
import Msg from './Msg'


export default function MsgStack () {
  // 消息栈
  const msgStack = ref([])

  // 根据消息栈，计算确定的展示文本
  const msgStackStr = computed(() => {
    return msgStack.value.reduce((pre, item) => {
      const { type, data } = item || {}
      switch (type) {
        case 'text': 
          return `${pre}${data}`
          break;
        case 'rel':
          return `${pre}@${data.label || ''} `
          break;
      }
    }, '')
  })
  
  // 格式化
  const levelingMsgData = () => {
    const reslut = []
    msgStack.value.forEach(msg => {
      const lastReslutMsg = reslut[reslut.length - 1]
      if (lastReslutMsg && lastReslutMsg.type === 'text' && msg.type === 'text' && msg.data) {
        lastReslutMsg.concat(msg)
        return
      }
      if (msg.type === 'text' && msg.render === '') return
      reslut.push(msg)
    });
    msgStack.value = reslut
  }

  const mergeTextMsg = (targeIndex, source, pos) => {
    const targe =  msgStack.value[targeIndex]
    targe.merge(source, pos) 
  }

  // 增加@ Msg到队尾
  const addRelMsg = (data) => {
    const newMsgStack = [...msgStack.value]
    const lastMsg = newMsgStack[newMsgStack.length - 1]
    // 计算覆盖裁剪区域
    const lastMsgLen = lastMsg.render.length
    const lastMshArr = lastMsg.render.split('@')
    const splitStr = lastMshArr.pop().length + 1
    lastMsg.remove(lastMsgLen - splitStr, lastMsgLen)
    newMsgStack.push(new Msg(data, 'rel'))
    msgStack.value = newMsgStack
    levelingMsgData()
  }
  // 增加指定字符到pos处
  const addSomeSymbolToPos = (addChar, pos) => {
    const newMsg = new Msg(addChar)
    let countPos = 0
    let findedMsg = null
    let findedMsgIndex = -1
    for (let i = 0; i < msgStack.value.length; i++) {
      const msg = msgStack.value[i]
      const msgLen = msg.render.length
      const strIndex = countPos
      const endIndex = countPos + msgLen - 1
      if (pos >= strIndex && pos <= endIndex) { // 插入位置，位于当前消息中
        findedMsg = msg
        findedMsgIndex = i
        break
      }
      countPos += msgLen
    }
    if (findedMsg) {
      mergeTextMsg(findedMsgIndex, newMsg, pos - countPos)
    } else {
      msgStack.value.push(newMsg)
    }
    levelingMsgData()
  }

  // 删除当前区域字符
  const removeSomeSymbolToPos = (propsStart, propsEnd) => {
    let start = propsStart
    let end = propsEnd
    if (propsStart === propsEnd) {
      start = propsStart - 1
    }
    let countPos = 0
    const queueToClear = []
    for (let i = 0; i < msgStack.value.length; i++) {
      const msg = msgStack.value[i]
      const msgLen = msg.render.length
      const curStrIndex = countPos
      const curEndIndex = countPos + msgLen - 1
      if (start <= curEndIndex && end >= curStrIndex) {
        const msgMaxStart = Math.max(curStrIndex, start); // 界定裁剪开始边界
        const msgMaxEnd = Math.min(curEndIndex, end); // 界定裁剪结束边界
        const queStart = msgMaxStart - curStrIndex
        let queEnd = msgMaxEnd - curStrIndex
        if (queStart === queEnd) {
          queEnd = queEnd + 1
        }
        queueToClear.push({
          findedMsgIndex: i,
          start: queStart,
          end: queEnd,
        })
      }
      countPos += msgLen
    }
    queueToClear.forEach(clearItem => {
      const { findedMsgIndex, start, end } = clearItem
      const curMsg = msgStack.value[findedMsgIndex]
      curMsg.remove(start, end)
    })
    levelingMsgData()
  }
  
  return {
    msgStack,
    msgStackStr,
    addSomeSymbolToPos,
    removeSomeSymbolToPos,
    addRelMsg
  }
}
