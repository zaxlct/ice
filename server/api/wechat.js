import {getWechat} from '../wechat'

const client = getWechat()

export const getSignatureAsync = async url => {
  const tokenData = await client.fetchAccessToken()
  const accessToken = tokenData.access_token

  const ticketData = await client.fetchTicket(accessToken)

  let params = client.sign(ticketData.ticket, url)
  params.appId = client.appID
  return params
}
