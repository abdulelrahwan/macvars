// eventstats-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const playerstatstotal = new Schema({
        playerId: { type: String, required: true },
        isUpdated: { type: Boolean, required: true },
        matchHistory: {
            numMatchesPlayed: { type: Number, required: true },
            numMapsPlayed: { type: Number, required: true },
            numRoundsPlayed: { type: Number, required: true },
            winRate: { type: Number, required: true },
            rating: { type: Number, required: true },
            avgCombatScore: { type: Number, required: true },
            kills: { type: Number, required: true },
            deaths: { type: Number, required: true },
            assists: { type: Number, required: true },
            econRating: { type: Number, required: true },
            kpr: { type: Number, required: true },
            dpr: { type: Number, required: true },
            fbpr: { type: Number, required: true }
        },
        mapHistory: {
            stats: { type: Object, required: true }
        }
    }, {
        timestamps: true,
        minimize: false
    });

    return mongooseClient.model('playerstatstotal', playerstatstotal);
};
