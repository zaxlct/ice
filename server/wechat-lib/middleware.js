import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'

export default (opts, reply) => async (ctx, next) => {
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
    const data = await getRawBody(ctx.req, {
      length: ctx.length,
      limit: '1mb',
      encoding: ctx.charset
    })

    // 微信推送的原始数据包
    const content = await util.xmlTojs(data)
    // ctx.weixin = util.formatMessage(content.xml)
    ctx.weixin = {}

    await reply.apply(ctx, [ctx, next])
    // const xml = util.tpl(ctx.body, ctx.weixin)
    const xml = `
    <xml>
      <ToUserName><![CDATA[${content.xml.FromUserName[0]}]]></ToUserName>
      <FromUserName><![CDATA[${content.xml.ToUserName[0]}]]></FromUserName>
      <CreateTime>12345678</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${ctx.body}]]></Content>
    </xml>`

    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
  }
}
