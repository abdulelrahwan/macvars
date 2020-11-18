// playerstats-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const playerstats = new Schema({
    eventId: { type: String, required: true },
    matchId: { type: String, required: true },
    mapId: { type: String, required: true },
    teamId: { type: String, required: true },
    playerId: { type: String, required: true },
    avgCombatScore: { type: Number, required: true },
    kills: { type: Number, required: true },
    deaths: { type: Number, required: true },
    assists: { type: Number, required: true },
    econRating: { type: Number, required: true },
    firstBloods: { type: Number, required: true },
    plants: { type: Number, required: true },
    defuses: { type: Number, required: true },
    rating: { type: Number },
    agentId: { type: String }
  }, {
    timestamps: true
  });

  return mongooseClient.model('playerstats', playerstats);
};
