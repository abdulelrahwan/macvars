// events-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'events';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true },
    details: { type: String, required: true },
    date: {
      from: { type: String, required: true },
      to: { type: String, required: true }
    },
    teamIds: { type: Array, required: true },
    teamsObj: { type: Object, required: false },
    activePlayerIds: { type: Array, required: true },
    img: { type: Array, required: true },
    matchIds: { type: Array, required: true },
    groups: { type: Array, required: false},
    active: { type: Boolean, required: true},
    NofTeamsAdvanceInGroup: { type: Number, required: true},
    stream: { type: String, required: false },
    displayPlayoffs: { type: String, required: false},
    playoffs: { type: Array, required: true},
    slug: { type: String, required: false },
    numberOfTeams: { type: Number, required: true},
    totalPrizePool: { type: String, required: false},
    prizePoolTable: { type: Array, required: false},
    location: { type: String, required: true},
    flag: { type: String, required: false}
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
