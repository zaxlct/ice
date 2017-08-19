import * as api from '../api'

export const signature = async (ctx, next) => {
  const url = ctx.query.url
  if(!url) ctx.throw(404)

  const params = await api.getSignatureAsync(url)

  ctx.body = {
    success: true,
    params,
  }
}