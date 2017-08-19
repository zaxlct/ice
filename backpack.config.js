module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = './server/wechat.js'
    return config
  }
}
