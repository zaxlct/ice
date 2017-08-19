import Router from 'koa-router'
import wechatMiddle from '../wechat-lib/middleware'
import config from '../config'
import { signature, redirect, oauth } from '../controllers/wechat'

export const router = app => {
  const router = new Router()
  router.all('/wechat-hear', wechatMiddle(config.wechat))
  router.get('/wechat-signature', signature)
  router.get('/wechat-redirect', redirect) // 访问这个 URL 会重定向到微信的官方授权页面，这个 URL 上可以加一下query 参数
  router.get('/wechat-oauth', oauth) // 在微信官方授权页面点击确定后，回到这个 URL，此时这个 URL 会有微信的 code，和上面定义的 query

  app.use(router.routes()).use(router.allowedMethods())
}
