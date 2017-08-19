import mongoose from 'mongoose'
import config from '../config'
import Wechat from '../wechat-lib'
import WechatOAuth from '../wechat-lib/oauth'

const Token = mongoose.model('Token')
const Ticket = mongoose.model('Ticket')

const wechatConfig = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token: config.wechat.token,
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async data => await Token.saveAccessToken(data),
    getTicket: async () => await Ticket.getTicket(),
    saveTicket: async (data) => await Ticket.saveTicket(data),
  }
}

export const getWechat = () => new Wechat(wechatConfig.wechat)
export const getOAuth = () => new WechatOAuth(wechatConfig.wechat)
