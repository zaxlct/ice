import {getWechat, getOAuth} from '../wechat'

const client = getWechat()
const oauth = getOAuth()

export const getSignatureAsync = async url => {
  const tokenData = await client.fetchAccessToken()
  const accessToken = tokenData.access_token

  const ticketData = await client.fetchTicket(accessToken)

  let params = client.sign(ticketData.ticket, url)
  params.appId = client.appID
  return params
}

export const getAuthorizeURL = (...args) => {
  return oauth.getAuthorizeURL(...args)
}

export const getUserByCode = async code => {
  const data = await oauth.fetchAccessToken(code)
  const user = await oauth.getUserInfo(data.access_token, data.openid)

  return user
}
