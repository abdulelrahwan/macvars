module.exports = (options = {})=>{
    return async(context) => {
        const eventStatsService = context.app.service('api/eventstats');
        let eventStatsData = await eventStatsService.find({query:{"eventId":context.data.eventId}});

        let stat = eventStatsData.data[0];
        stat.isUpdated = false;
        await eventStatsService.update(stat._id, stat)
        return context
    };
};
