import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'
import replyToWexinTemplate from './replyTpl'

export default opts => async (ctx, next) => {
  const token = opts.token
  const {
    signature,
    nonce,
    timestamp,
    echostr,
  } = ctx.query

  const str = [token, timestamp, nonce].sort().join('')
  const sha = sha1(str)
  console.log(sha === signature)

  if (sha !== signature) {
    ctx.body = 'Failed'
    return false
  }

  if (ctx.method === 'GET') {
    ctx.body = echostr
  } else if (ctx.method === 'POST') {
    const receiveFromWeixinXML = await getRawBody(ctx.req, {
      length: ctx.length,
      limit: '1mb',
      encoding: ctx.charset
    })

    // 微信推送的原始数据包
    const receiveFromWeixinJSON = await util.xmlToJs(receiveFromWeixinXML)
    const receiveFromWeixinMessage = util.formatMessage(receiveFromWeixinJSON.xml)

    const replyToWexinTplData = await replyToWexinTemplate(receiveFromWeixinMessage)
    const {
      FromUserName,
      ToUserName
    } = receiveFromWeixinMessage
    const replyToWexinXML = util.dataToXmlTpl(ToUserName, FromUserName, replyToWexinTplData)

    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = replyToWexinXML
  }
}
