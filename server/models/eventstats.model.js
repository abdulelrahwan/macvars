// eventstats-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const eventstats = new Schema({
    eventId: { type: String, required: true },
    isUpdated: {type: Boolean, required: true},
    topPlayers: {type: Array, required: true},
    topAgents: {type: Array, required: true}
  }, {
    timestamps: true
  });

  return mongooseClient.model('eventstats', eventstats);
};
