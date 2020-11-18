// riotuser-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const riotuser = new Schema({
    riotId: { type: String, required: true },
    data: { type: Array, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('riotuser', riotuser);
};
