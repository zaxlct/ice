import request from 'request-promise'

const base = 'https://api.weixin.qq.com/sns/'
const api = {
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
  accessToken: base + 'oauth2/access_token?',
  userInfo: base + 'userinfo?'
}

export default class WechatOAuth {
  constructor (opts) {
    this.appID = opts.appID
    this.appSecret = opts.appSecret
  }

  async request (options) {
    options = Object.assign({}, options, {json: true})

    try {
      const response = await request(options)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  /*
   * @scope
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
   * 'snsapi_base' 静默授权，只能获得 openid
   * 'snsapi_userinfo' 需要用户点击同意，授权后可获取该用户的基本信息。
   *
   * @target 授权后重定向的回调链接地址，
   *
   * @state 业务逻辑参数
   *
   * @return B 网址的 URL
   */
  getAuthorizeURL (scope = 'snsapi_base', target, state) {
    return `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
  }

  // 用拿到的 code，拼接 URL 换取 access_token 和 openID
  async fetchAccessToken (code) {
    const url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
    const data = await this.request({url})
    return data
    // {
    //   access_token: '6g74501x2DOqmpwXLWNfwJKIw2jy8SQABbuNSCDVZTktD6vSxtm9HTDnYi5GF46IAK4MjWO6HvngWZFE50Ks7g',
    //   expires_in: 7200,
    //   refresh_token: 'wceH8e0sspsOD6isxF4846Epi-_wys3mevRJ6GcJqLsF3Ut2cFzlFMxwjoLAHJcoamw7m80zjMPPU3nea_QDnQ',
    //   openid: 'oFP-qv8z-xdZz3qK80467KFt4rQA',
    //   scope: 'snsapi_userinfo'
    // }
  }

  // 用  access_token 和 openID 获取用户的基本信息
  async getUserInfo (token, openID, lang='zh_CN') {
    const url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=${lang}`
    const data = await this.request({url})

    return data
  }
}

// 用户在微信中打开你的网址 A
// 你在服务器里面偷换下给他重定向到网址 B
// 用户眼睁睁看着 B 网址展现一个是否同意授权的按钮
// 用户闭眼按下去，网址 B 跳到了 网址 C
// 你在服务器里面拿到了网址 C 上面的 code
// 你在服务器里面拿着 code 和 公众号 id/secret 拼了个网址 D
// 你在服务器里面请求网址 D 要回来 access_token 和 openID
// 你在服务器里面拿着 openID 去请求用户资料


// openID 还是那个 openID，而 access_token 不是那个 access_token