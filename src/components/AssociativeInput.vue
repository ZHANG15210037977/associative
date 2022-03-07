<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: zhangguijun8
 * @Date: 2022-03-05 11:40:16
 * @LastEditors: zhangguijun8
 * @LastEditTime: 2022-03-07 21:12:23
-->
<script setup>
  import { ref, computed,  watchEffect, toRaw, toRefs, onMounted, nextTick } from 'vue'
  import $ from 'jquery'
  import PinyinMatch from 'pinyin-match';
  import ContactSelect from './ContactSelect.vue'
  import MsgStack from './MsgStack'

  const { contactList } = defineProps({
    value: Object,
    contactList: Array,
  })

  const emits  = defineEmits(['change'])

  // 初始化消息盒子
  const { msgStack, msgStackStr, addSomeSymbolToPos, removeSomeSymbolToPos, addRelMsg } = MsgStack()
  
  // 是否展示关联弹窗&展示数据
  const contactRef = ref(null)
  const showContactSelectKey = ref(false)
  const showContactList = ref([])
  const showTop = ref(0)
  const showLeft = ref(0)
  let isProcess = null
  let clickPos = null

  onMounted(() => {
    document.onmouseup = function(e =  window.event){
        const target = e.target || e.srcElement;
        const dialogEl = $(contactRef.value?.$el)
        //1. 点击事件的对象不是目标区域本身
        //2. 事件对象同时也不是目标区域的子元素
        if(!dialogEl.is(e.target) && dialogEl.has(e.target).length === 0){
            showContactSelectKey.value = false
        }
    }
  })

  // 以联系人id为key，生产个map
  const contactMap = computed(() => {
    const reslut = new Map()
    contactList.forEach(item => {
      const {value} = item
      reslut.set(value, item)
    })
    return reslut
  })

  // 用于匹配联系人，最基础字符匹配
  const fillterContactFn = (targeStr, keyStr) => {
    if (!keyStr) return true
    return PinyinMatch.match(targeStr, keyStr)
  }

  // 初始化用来模拟计算光标所在位置的外部容器
  const getPosFormCreatAtRectDiv = (html) => {
    // 初始化
    const input = $('#inputBox');
    const atRect = $('<div></div>')

    // css拷贝
    const css_attr = ["width","borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle", "borderTopWidth", "boxSizing", "fontFamily", "fontSize", "fontWeight", "height", "letterSpacing", "lineHeight", "marginBottom", "marginLeft", "marginRight", "marginTop", "outlineWidth", "overflow", "overflowX", "overflowY", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "textAlign", "textOverflow", "textTransform", "whiteSpace", "wordBreak", "wordWrap"]
    const css = {
      position: 'absolute',
      left: -99999,
      top: 0,
      zIndex: -20000,
    }
    css_attr.forEach(attr => {
      css[attr] = input.css(attr)
    })

    // 容器挂载
    atRect.css(css)
    atRect.html(html)
    input.after(atRect);
    
    // 位置计算
    const flag = atRect.find("#caret");
    window.flag = flag
    const { left, top } = flag.position();
    const xoy = {
      left,
      top,
      height: flag.height()
    };
    // 容器销毁
    // debugger
    atRect.remove();
    return xoy;
  }

  // 获取生效关键字符@的位置
  const getTargeKeySymbolXoy = (reactStrLen) => {
    const input = $('#inputBox')
    const inputPos = input.selectionStart - reactStrLen
    const start_range = input.val().slice(0, inputPos);
    const end_range = input.val().slice(inputPos);
    const pos = getPosFormCreatAtRectDiv(`<span style='position: relative; display: inline;'>${ end_range }</span><span id='caret' style='position: relative; display: inline;'>|</span><span style='position: relative; display: inline;'>${start_range}</span>`)
    const offset = input.offset()
    return {
      top: offset.top + pos.top - input.scrollTop(),
      left: offset.left + pos.left - input.scrollLeft(),
      height: pos.height
    }
  }

  // 获取四边自适应放置点，入参为 目标@坐标
  const getAdapterPosition = (pos) => {
    const fixGap = 6 // 视觉偏移补正
    pos.top = pos.top - fixGap
    pos.left = pos.left - fixGap
    pos.height = pos.height + fixGap
    const dialogEl = contactRef.value?.$el // 弹窗el dom
    const dialogElWidth = dialogEl.offsetWidth // 弹窗宽
    const dialogElHeight = dialogEl.offsetHeight // 弹窗高
    const clientWidth = document.scrollingElement.clientWidth // 窗口有效宽度
    const clientHeight = document.scrollingElement.clientHeight // 窗口有效高度
    const clientScrollTop = document.scrollingElement.scrollTop // 视窗滚动高度
    const pointToClientTop = pos.top - clientScrollTop // 预置坐标点到窗口顶边距
    const pointToClientBottom = clientHeight - pointToClientTop // 预置坐标点到窗口底边距
    const pointToClientLeft = pos.left // 预置坐标点到窗口左边距
    const pointToClientRight = clientWidth - pointToClientLeft // 预置坐标点到窗口右边距

    // 放置顺序，右上、右下、左上、左下
    if ((pointToClientTop >= dialogElHeight) && (pointToClientRight >= dialogElWidth)) {
      return {
        top: pointToClientTop - dialogElHeight,
        left: pointToClientLeft,
      }
    } else if (((pointToClientBottom - pos.height) >= dialogElHeight) && (pointToClientRight >= dialogElWidth)) {
      return {
        top: pointToClientTop + pos.height,
        left: pointToClientLeft,
      }
    } else if ((pointToClientTop >= dialogElHeight) && (pointToClientLeft >= dialogElWidth)) {
      return {
        top: pointToClientTop - dialogElHeight,
        left: pointToClientLeft - dialogElWidth,
      }
    } else if (((pointToClientBottom - pos.height) >= dialogElHeight) && pointToClientLeft >= dialogElWidth) {
      return {
        top: pointToClientTop + pos.height,
        left: pointToClientLeft - dialogElWidth,
      }
    } else {
      return {
          top: pointToClientTop > pointToClientBottom ? pointToClientTop - dialogElHeight : pointToClientTop + pos.height,
          left: pointToClientLeft > pointToClientRight ? pointToClientLeft - dialogElWidth : pointToClientLeft,
      }
    }
  }

  // 关联弹窗展示校验规则集，返回[key, Array], key为校验结果，Array为检验通过后，筛选展示的联系人
  const showContactBoxRules = (str, contactListArr) => {
    const isHasSymbol = str.indexOf('@') !== -1 // 是否含有关键字符
    if (!isHasSymbol) return [false] // 不含关键字符，不展示

    const targeKeySymbolIndex = str.lastIndexOf('@') // 生效关键字符位置，最后一个生效关键字符位置
    const preSymbol = str.slice(targeKeySymbolIndex - 1, targeKeySymbolIndex) // 筛选前置字符，生效关键字符  前一个字符值
    const reactStr = str.slice(targeKeySymbolIndex + 1) // 筛选字符，最后一个生效关键字符 后 筛选区域字符
    if (reactStr.indexOf(' ') !== -1) return [false] // 筛选字符中 有空格，关闭
    if (/^[A-Za-z0-9]*$/.test(preSymbol) && preSymbol !== '') return [false] // 筛选前置字符为数字或字母，可能要输入值为邮箱, 关
    const newContactListArr = contactListArr.filter(item => fillterContactFn(item.label, reactStr)) // 筛选出匹配联系人
    if (newContactListArr.length <= 0) return [false]
    return [true, newContactListArr, getTargeKeySymbolXoy(reactStr.length)]
  }

  // 录入区值变动时，进行解析
  watchEffect(() => {
    // 获取解析结果
    const [showKey, newContactListArr , pos] = showContactBoxRules(`${msgStackStr.value}`, contactList)
    if (showKey) { // 展示
      showContactList.value = newContactListArr
      showContactSelectKey.value = true
      nextTick(() => {
        const { top, left } = getAdapterPosition(pos)
        showTop.value = top
        showLeft.value = left
      })
    } else { // 隐藏
      showContactSelectKey.value = false
    }
  })

  // 对外change事件
  watchEffect(() => {
    emits('change', [
      ...msgStack.value
    ])
  })


  // 选择联系人回调
  const handleSelectContact = (key) => {
    const targeContactItem = contactMap.value.get(key)
    if (targeContactItem) {
      addRelMsg(targeContactItem)
    }
  }

  // 找出何处减少，计算出pos，通知消息盒子更新信息
  const removeSomeSymbol = (event) => {
    const { target } = event
    const posStart = target.selectionStart
    const posEnd = target.selectionEnd
    removeSomeSymbolToPos(posStart, posEnd)
  }

  // 找出何处增多，计算出pos，通知消息盒子更新信息
  const addSomeSymbol = (event) => {
    const { target, key } = event
    const posStart = target.selectionStart
    const posEnd = target.selectionEnd
    if (posStart === posEnd) {
      addSomeSymbolToPos(key, posStart)
    } else {
      removeSomeSymbolToPos(posStart, posEnd)
      addSomeSymbolToPos(key, posStart)
    }
  }

  // 键盘弹起回调
  const handleKeydown = (e) => {
    const noInputKey = ['Meta', 'Alt', 'Control', 'Shift', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'CapsLock', 'Tab']
    const { keyCode, key } = e || {}
    isProcess = null
    if (!keyCode) return
    if (keyCode === 8) {
      // 删除
      removeSomeSymbol(e)
    } else if ( key === 'Process') { // 点击时记录了 坐标信息 & 文本信息，且当前为输入法录入，记录
      if (clickPos) isProcess = { ...clickPos }
    } else if (!noInputKey.includes(key)) {
      // 新增
      addSomeSymbol(e)
    }
  }

  const handleInput = (newVal) => {
    if (isProcess) { // 如果中文输入信息存在
      const { posStart, posEnd, value } = isProcess
      const targeStrLen = newVal.length - value.length
      const targeStr = newVal.slice(posStart, posStart + targeStrLen)
      addSomeSymbolToPos(targeStr, posStart)
      clickPos = isProcess = null
      nextTick(() => {
        const target = document.getElementById('inputBox')
        const { selectionStart, selectionEnd, value } = target || {}
        clickPos = {
          posStart: selectionStart,
          posEnd: selectionEnd,
          value
        }
      })
    }
  }

  const handleClick = (event) => {
    const { target } = event || {}
    const { selectionStart, selectionEnd, value } = target || {}
    clickPos = {
      posStart: selectionStart,
      posEnd: selectionEnd,
      value
    }
  }

  defineExpose({
    handleKeydown,
    handleInput,
    handleClick,
  })
</script>

<template>
  <slot 
    :value="msgStackStr"
    :id="'inputBox'"
  >
    <el-input
      id="inputBox"
      v-model="msgStackStr"
      type="textarea"
      placeholder="Please input"
      :rows="3"
      @keydown="handleKeydown"
      @input="handleInput"
      @click="handleClick"
    />
  </slot>
  <ContactSelect
    ref="contactRef"
    v-show="showContactSelectKey"
    :contactList="showContactList"
    :top="`${showTop}px`"
    :left="`${showLeft}px`"
    @click="handleSelectContact"
  />
</template>

<style scoped>
#inputBox{
  width: 100%;
}
</style>
