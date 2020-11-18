require('mongoose-type-email');

module.exports = function (app) {
  const modelName = 'listings';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    userId : {
      type: String,
      required: [false]
    },
    destination : {
      from: {
        type: String,
        required: [true, 'From destination is required']
      },
      to: {
        type: String,
        required: [true, 'To destination is required']
      }
    },
    description : {
      type: String,
      required: [true, 'Description is required']
    },
    interestedUsers: {
      type: Array,
      default: []
    }
  }, {
    timestamps: true
  });

  return  mongooseClient.model(modelName,  schema);
};