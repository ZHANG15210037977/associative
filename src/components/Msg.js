/*
 * @Description: 
 * @Version: 1.0
 * @Autor: zhangguijun8
 * @Date: 2022-03-07 09:50:25
 * @LastEditors: zhangguijun8
 * @LastEditTime: 2022-03-07 17:34:24
 */
class Msg {
  constructor (data = '', type = 'text',) {
    this.type = type
    this.data = data
    switch (type) {
      case 'text':
        this.render = data
        break
      case 'rel':
        this.render = `@${data.label}`
        break
    }
  }

  // 连接两个msg对象，@类型会强转为text
  concat(msg) {
    if (!msg) return
    this.type = 'text'
    this.data = this.render = `${this.data}${msg.data}`
  }

  // 指定位置，插入一个msg对象，@类型会强转为text
  merge(msg, pos) {
    if (!msg || !msg.data) return
    this.type = 'text'
    this.data = this.render
    this.data = this.render = this.data.slice(0, pos) + msg.render + this.data.slice(pos);
  }

  // 删除开始位置到结束位置字符，@类型会强转为text
  remove(start, end) { 
    if (this.type === 'text') {
      this.data = this.render = this.data.slice(0, start) + this.data.slice(end);
    } else {
      this.type = 'text'
      this.data = this.render = ''
    }
  }
}

export default Msg
