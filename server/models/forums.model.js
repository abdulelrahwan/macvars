// forums-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'forums';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    userId: { type: String, required: true, immutable: true },
    type: { type: String, required: true, immutable: true },
    title: { type: String, required: true, immutable: true },
    body: { type: String, required: true, immutable: true },
    dateTime: { type: String, required: true, immutable: true },
    commentIds: { type: Array, required: true },
    slug: { type: String, required: false, immutable: true },
    numComments: { type: Number, required: false }
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
