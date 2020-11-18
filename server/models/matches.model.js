// matches-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'matches';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    teamOneId: { type: String, required: true },
    teamTwoId: { type: String, required: true },
    type: { type: String, required: false },
    dateTime: { type: String, required: true },
    active: { type: Boolean, required: true },
    mapIds: { type: Array, required: true },
    event: { type: String, required: true },
    hasStats: { type: Boolean, required: true },
    commentIds: { type: Array, required: false },
    streams: { type: Array, required: false },
    teamsDecided: { type: Boolean, required: true },
    slug: { type: String, required: false },
    numComments: { type: Number, required: false },
    activePlayerIds: { type: Array, required: true },
    defaultWin: { 
      teamOneScore: { type: Number, required: false },
      teamTwoScore: { type: Number, required: false }
     }
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
