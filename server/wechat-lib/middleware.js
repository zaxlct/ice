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
    ctx.weixin = util.formatMessage(content.xml)

    await reply.apply(ctx, [ctx, next])

    /*
     * @ctx.weixin 接收到的微信推送的事件提醒 or 接收到的微信推送的普通消息，原本是 xml 格式，在这里是格式后的 JSON 格式
     * @ctx.body 准备回复给微信用户的消息体
     * ctx.weixin + ctx.body 组成回复给用户的 XML 结构体
     */
    const xml = util.tpl(ctx.body, ctx.weixin)

    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
  }
}
