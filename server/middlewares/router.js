import Router from 'koa-router'
import wechatMiddle from '../wechat-lib/middleware'
import config from '../config'

export const router = app => {
  const router = new Router()
  router.all('/wechat-hear', wechatMiddle(config.wechat))

  app.use(router.routes()).use(router.allowedMethods())
}
