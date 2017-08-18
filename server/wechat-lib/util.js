import xml2js from 'xml2js'
import template from './template'

export const xmlTojs = xml => new Promise((resolve, reject) => {
  xml2js.parseString(xml, {trim: true}, (err, content) => {
    if (err) reject(err)
    else resolve(content)
  })
})

export const formatMessage = result => {
  let message = {}
  if (typeof result === 'object') {
    const keys = Object.keys(result)

    for (let i = 0; i < keys.length; i++) {
      let item = result[keys[i]]
      let key = keys[i]

      if (!(item instanceof Array) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        let val = item[0]
        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = []
        for (let i = 0; i < item.length; i++) {
          message[key].push(formatMessage(item[i]))
        }
      }
    }
  }

  return message
}

/*
 * @Content 自定义的回复内容，可是是字符串，也可能是包含好几个字段的对象
 * @Message 接收微信推送的事件提醒 or 接收微信推送的普通消息，原本是 xml 格式，在这里是 JSON 格式
 */
export const tpl = (content = 'Empty News', message) => {
  let msgType = 'text'
  if (Array.isArray(content)) {
    msgType = 'news'
  }
  if (content.type) {
    msgType = content.type
  }

  const info = Object.assign({}, {
    content,
    msgType,
    createTime: new Date().getTime(),
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
  })

  return template(info)
}
