// maps-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const maps = new Schema({
    mapId: { type: String, required: true },
    teamOneScore: { type: String, required: true },
    teamTwoScore: { type: String, required: true },
    playerStatIds: {type: Array, required: true},
    tba: {type: Boolean, required: false},
    active: {type: Boolean, required: false}
  }, {
    timestamps: true
  });

  return mongooseClient.model('maps', maps);
};
