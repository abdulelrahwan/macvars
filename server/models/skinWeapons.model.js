// skinWeapons-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'skinWeapons';
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const schema = new Schema({
        name: { type: String, required: true },
        bundleId: { type: String, required: false },
        description: {type: String, required: true},
        imgs: {type: Array, required: true},
        price: {type: Number, required: false},
        video: { type: String, required: false }
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
