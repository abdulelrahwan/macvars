// players-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'players';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true },
    realName: {
      first: { type: String, required: false },
      last: { type: String, required: false }
    },
    nationality: { type: String, required: false },
    socials:{
      twitter: { type: String, required: false },
      twitch: { type: String, required: false }
    },
    img: { type: String, required: true },
    team: { type: String, required: true },
    flag: { type: String, required: false },
    slug: { type: String, required: false }
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
