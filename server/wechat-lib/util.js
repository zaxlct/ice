import xml2js from 'xml2js'
import ejs from 'ejs'

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
export const dataToXmlTpl = (ToUserName, FromUserName, content = 'Empty News') => {
  /*****/
  // 这段 msgType 判断代码是因为 content 里偷懒没有为 'text' 和 'new' 类型设置 type
  let msgType = 'text'
  if (Array.isArray(content)) {
    msgType = 'news'
  }
  if (content.type) {
    msgType = content.type
  }
  /*****/

  const info = {
    content,
    msgType,
    createTime: new Date().getTime(),
    toUserName: FromUserName,
    fromUserName: ToUserName,
  }

  const XmlTemplate = `
  <xml>
    <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
    <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
    <CreateTime><%= createTime %></CreateTime>
    <MsgType><![CDATA[<%= msgType %>]]></MsgType>
    <% if (msgType ==='text') { %>
      <Content><![CDATA[<%- content %>]]></Content>
    <% } else if (msgType === 'image') { %>
      <Image>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
      </Image>
    <% } else if (msgType === 'voice') { %>
      <Voice>
        <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
      </Voice>
    <% } else if (msgType === 'video') { %>
      <Video>
        <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
        <Title><![CDATA[<%= content.title %>]]></Title>
        <Description><![CDATA[<%= content.description %>]]></Description>
      </Video>
    <% } else if (msgType === 'music') { %>
      <Music>
        <Title><![CDATA[<%= content.title %>]]></Title>
        <Description><![CDATA[<%= content.description %>]]></Description>
        <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
        <HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
      </Music>
    <% } else if (msgType === 'news') { %>
      <ArticleCount><%= content.length %></ArticleCount>
      <Articles>
        <% content.forEach(function(item) { %>
          <item>
            <Title><![CDATA[<%= item.title %>]]></Title>
            <Description><![CDATA[<%= item.description %>]]></Description>
            <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
            <Url><![CDATA[<%= item.url %>]]></Url>
          </item>
        <% }) %>
      </Articles>
    <% } %>
  </xml>
`

  return ejs.compile(XmlTemplate)(info)
}
