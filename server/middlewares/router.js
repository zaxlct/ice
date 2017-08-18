import Router from 'koa-router'
import wechatMiddle from '../wechat-lib/middleware'
import config from '../config'
import reply from '../wechat/reply'

export const router = app => {
  const router = new Router()
  router.all('/wechat-hear', wechatMiddle(config.wechat, reply))

  app.use(router.routes()).use(router.allowedMethods())
}
