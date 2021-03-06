import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TokenSchema = new Schema({
  name: String,
  token: String,
  expire_in: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

TokenSchema.statics = {
  async getAccessToken () {
    const token = await this.findOne({
      name: 'access_token'
    }).exec()
    if (token && token.token) {
      token.accessToken = token.token
    }
    return token
  },

  async saveAccessToken (data) {
    let token = await this.findOne({
      name: 'access_token'
    }).exec()

    if (token) {
      token.token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in
      })
    }

    await token.save()
    return data
  }
}

const Token = mongoose.model('Token', TokenSchema)
