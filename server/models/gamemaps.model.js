// gamemaps-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const gamemaps = new Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    active: { type: Boolean, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('gamemaps', gamemaps);
};
