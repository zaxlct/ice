import * as api from '../api'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'

export const signature = async (ctx, next) => {
  let url = ctx.query.url
  if(!url) ctx.throw(404)
  url = decodeURIComponent(url)

  const params = await api.getSignatureAsync(url)

  ctx.body = {
    success: true,
    params,
  }
}

// 网页上点某按钮，直接跳转到 http://x.o/wechat-redirect?visit=a&id=b
// 用户被重定向到 Wechat Redirect URL 授权验证
// 验证后，自动二跳进入 http://x.o/oauth?code=xxxxxx&state=a_b
export const redirect = async (ctx, next) => {
  const target = config.SITE_ROOT_URL + '/oauth'
  const scope = 'snsapi_userinfo'
  const { a,b } = ctx.query
  const params = a + '_' + b

  const url = api.getAuthorizeURL(scope, target, params)
  ctx.redirect(url)
}

export const oauth = async (ctx, next) => {
  const url = ctx.query.url
  const urlObj = urlParse(decodeURIComponent(url))
  const params = queryParse(urlObj.query)
  const code = params.code
  const user = await api.getUserByCode(code)

  console.log(user)
  ctx.session = {
    openid: user.openid
  }
  ctx.body = {
    success: true,
    user: user
  }
}
