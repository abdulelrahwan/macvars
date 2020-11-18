// news-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'news';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    title: { type: String, required: true, immutable: false },
    details: { type: String, required: true , immutable: false},
    preview: { type: String, required: false, immutable: false },
    date: { type: String, required: true, immutable: false },
    img: { type: String, required: true, immutable: false },
    author: { type: String, required: true , immutable: false},
    authorLink: { type: String, required: true, immutable: false },
    commentIds: { type: Array, required: false },
    slug: { type: String, required: false, immutable: false },
    numComments: { type: Number, required: false },
    flag: { type: String, required: false, immutable: false}
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
