import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TicketSchema = new Schema({
  name: String,
  ticket: String,
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

TicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

TicketSchema.statics = {
  async getTicket () {
    return await this.findOne({name: 'ticket'}).exec()
  },

  async saveTicket (data) {
    let ticket = await this.findOne({name: 'ticket'}).exec()

    if (ticket) {
      ticket.ticket = data.ticket
      ticket.expires_in = data.expires_in
    } else {
      ticket = new Ticket({
        name: 'ticket',
        ticket: data.ticket,
        expires_in: data.expires_in
      })
    }

    try {
      await ticket.save()
    } catch (e) {
      console.log('存储失败')
      console.log(e)
    }

    return data
  }
}

const Ticket = mongoose.model('Ticket', TicketSchema)
