module.exports = (options = {})=>{
    return async(context) => {
        const playerStatsService = context.app.service('api/playerstats');
        const eventStatsService = context.app.service('api/eventstats');
        const eventId = context.params.query.eventId;
        let eventStatData = await eventStatsService.find({query:{eventId:eventId}});
        let eventStat = eventStatData.data[0]
        // Dont process if up to date
        if(eventStat.isUpdated){
            context.result = eventStat
            return context
        }

        let statsData = await playerStatsService.find(context.params);
        let stats = statsData.data
        let players = {}
        let agents = {}
        
        // Compute Stats
        for(let i=0;i<stats.length;i++){
            let player = stats[i];
            if(player.deaths === 0){
                continue
            }
            if(players[player.playerId]){
                let tempPlayer = players[player.playerId]
                players[player.playerId] = {
                    matches: tempPlayer.matches + 1,
                    avgCombatScore: tempPlayer.avgCombatScore + (player.avgCombatScore - tempPlayer.avgCombatScore )/(tempPlayer.matches + 1),
                    kills: player.kills + tempPlayer.kills,
                    deaths: player.deaths + tempPlayer.deaths,
                    assists: player.assists + tempPlayer.assists,
                    kd: (player.kills + tempPlayer.kills)/(player.deaths + tempPlayer.deaths)
                }
            }else{
                players[player.playerId] = {
                    matches: 1,
                    avgCombatScore: player.avgCombatScore,
                    kills: player.kills,
                    deaths: player.deaths,
                    assists: player.assists,
                    kd: player.kills/player.deaths
                }
            }
            if(player.agentId){
                if(player.agentId === "5eaa00059aed6018f4efeaf6"){
                    console.log(1)
                }
                if(agents[player.agentId]){
                    let tempAgent = agents[player.agentId]
                    agents[player.agentId] = {
                        matches: tempAgent.matches + 1,
                        avgCombatScore: tempAgent.avgCombatScore + (player.avgCombatScore - tempAgent.avgCombatScore )/(tempAgent.matches + 1),
                        kills: player.kills + tempAgent.kills,
                        deaths: player.deaths + tempAgent.deaths,
                        assists: player.assists + tempAgent.assists,
                        kd: (player.kills + tempAgent.kills)/(player.deaths + tempAgent.deaths)
                    }
                } else{
                    agents[player.agentId] = {
                        matches: 1,
                        avgCombatScore: player.avgCombatScore,
                        kills: player.kills,
                        deaths: player.deaths,
                        assists: player.assists,
                        kd: player.kills/player.deaths
                    }
                }
                
            }
        }
        // Convert to array and sort
        let playersArray = []
        for(key in players){
            let temp = players[key];
            temp.playerId = key;
            playersArray.push(temp)
        }
        playersArray.sort((a,b)=>{return b.avgCombatScore - a.avgCombatScore})
        let agentsArray = []
        for(key in agents){
            let temp = agents[key];
            temp.agentId = key;
            agentsArray.push(temp)
        }
        agentsArray.sort((a,b)=>{return b.avgCombatScore - a.avgCombatScore})
        // playersArray = playersArray.slice(0,10);

        // Update with player name
        const playersService = context.app.service('api/players');
        for(let i=0;i<playersArray.length;i++){
            let playerData = await playersService.find({query:{"_id":playersArray[i].playerId}});
            playersArray[i].playerName = playerData.data[0].name;
            playersArray[i].slug = playerData.data[0].slug;
            playersArray[i].img = playerData.data[0].img;
        }
        // Update with agent name
        const agentsService = context.app.service('api/agents');
        for(let i=0;i<agentsArray.length;i++){
            let agentData = await agentsService.find({query:{"_id":agentsArray[i].agentId}});
            agentsArray[i].name = agentData.data[0].name;
            agentsArray[i].img = agentData.data[0].img;
        }
        // console.log(agentsArray)
        // update event stat document
        eventStat.topPlayers = playersArray;
        eventStat.topAgents = agentsArray;
        eventStat.isUpdated = true;
        await eventStatsService.update(eventStat._id, eventStat)
        context.result = eventStat
        return context
    };
};
