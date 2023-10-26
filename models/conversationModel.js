const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
 members: [],
},{timestamps: true})
conversationSchema.pre('remove', async function(next) {

    await this.model('Message').deleteMany({ conversationId: this._id });
    next();
});
module.exports = mongoose.model('Conversation', conversationSchema)
  