// module.exports = (options = {}) => {
//     return async (context) => {
//         const async = require('async')
//         // TODO RETURN IF MATCH IS NOT FINISHED YET
//         // console.log(context)
//         let matchId = context.id;
//         const matchesService = context.app.service('api/matches');
//         const playerStatsTotalService = context.app.service('api/playerstatstotal');
//         let matchesDataArray = await matchesService.find({ query: { "_id": matchId, populatemaps: true } });
//         console.log("herere")
//         let match = matchesDataArray.data[0]
//         if (match.active === true && match.isStatsUpdated === undefined || match.isStatsUpdated === true) {
//             return context
//         }
//         console.log("herehrerherjhehrjhejkrhjsdhfksdjfhs")
//         match.isStatsUpdated = true;
//         matchesService.update(match._id, match).then(response => {  });
//         let matchHistory = {
//             numMatchesPlayed: 0,
//             winRate: 0
//         }
//         let mapHistory = {
//             maps: {
//                 "5eac71037009411af47aa38e": {
//                     numPlayed: 3,
//                     avgCombatScore: 0,
//                     kills: 0,
//                     deaths: 0,
//                     assists: 0,
//                     winRate: 55,
//                     roundsWon: 22,
//                     roundsLost: 11
//                 }
//             }
//         }
//         let teamOneWin = 0;
//         let teamTwoWin = 0;
//         for (let i = 0; i < match.maps.length; i++) {
//             if (parseInt(match.maps[i].teamOneScore) > parseInt(match.maps[i].teamTwoScore)) {
//                 teamOneWin += 1
//             }
//             if (parseInt(match.maps[i].teamOneScore) < parseInt(match.maps[i].teamTwoScore)) {
//                 teamTwoWin += 1
//             }
//         }
//         let mapsWon = 0;
//         let mapsLost = 0;

//         async.eachSeries(match.maps, (map, callback) => {
//             // Case for no stats for map
//             if (map.playerStats.length === 0) {
//                 if (match.mapIds.indexOf(map._id.toString()) === match.mapIds.length - 1) {
//                     async.eachSeries(match.activePlayerIds, (playerId, callback) => {
//                         playerStatsTotalService.find({ query: { "playerId": playerId } }).then((currStatData) => {
//                             let currStat = currStatData.data[0]
//                             // Player in team One
//                             if (match.teamOne.playerIds.indexOf(playerId) != -1) {
//                                 if (teamOneWin > teamTwoWin) {
//                                     currStat.matchHistory.winRate = ((currStat.matchHistory.winRate * currStat.matchHistory.numMatchesPlayed) + 1) / (currStat.matchHistory.numMatchesPlayed + 1)
//                                 } else if (teamTwoWin > teamOneWin) {
//                                     currStat.matchHistory.winRate = ((currStat.matchHistory.winRate * currStat.matchHistory.numMatchesPlayed)) / (currStat.matchHistory.numMatchesPlayed + 1)
//                                 }
//                             }
//                             // Player in team Two
//                             if (match.teamTwo.playerIds.indexOf(playerId) != -1) {
//                                 if (teamOneWin < teamTwoWin) {
//                                     currStat.matchHistory.winRate = ((currStat.matchHistory.winRate * currStat.matchHistory.numMatchesPlayed) + 1) / (currStat.matchHistory.numMatchesPlayed + 1)
//                                 } else if (teamTwoWin < teamOneWin) {
//                                     currStat.matchHistory.winRate = ((currStat.matchHistory.winRate * currStat.matchHistory.numMatchesPlayed)) / (currStat.matchHistory.numMatchesPlayed + 1)
//                                 }
//                             }
//                             currStat.matchHistory.numMatchesPlayed += 1
//                             playerStatsTotalService.update(currStat._id, currStat).then(response => { callback() });
//                         })
//                     }, (err) => {
//                         if (err) {
//                             console.log('error', err);
//                         } else {
//                             callback()
//                         }
//                     })
//                     return
//                 }
//                 return;
//             }
//             async.eachSeries(map.playerStats, (stat, callback) => {
//                 playerStatsTotalService.find({ query: { "playerId": stat.playerId } }).then((currStatData) => {
//                     let currStat = currStatData.data[0]
//                     // console.log(currStat)
//                     // currStat.mapHistory.stats[map.map._id] = mapHistory.maps[map.map._id];
//                     if (currStat.mapHistory.stats[map.map._id] === undefined) {
//                         currStat.mapHistory.stats[map.map._id] = {
//                             numPlayed: 0,
//                             avgCombatScore: 0,
//                             kills: 0,
//                             deaths: 0,
//                             assists: 0,
//                             winRate: 0,
//                             roundsWon: 0,
//                             roundsLost: 0,
//                             agents: {}
//                         }
//                     }
//                     if (stat.agentId) {
//                         if (currStat.mapHistory.stats[map.map._id].agents[stat.agentId]) {
//                             currStat.mapHistory.stats[map.map._id].agents[stat.agentId] += 1
//                         } else {
//                             currStat.mapHistory.stats[map.map._id].agents[stat.agentId] = 1
//                         }
//                     }

//                     currStat.mapHistory.stats[map.map._id].numPlayed += 1;
//                     currStat.mapHistory.stats[map.map._id].avgCombatScore = ((currStat.mapHistory.stats[map.map._id].avgCombatScore * (currStat.mapHistory.stats[map.map._id].numPlayed - 1)) + parseInt(stat.avgCombatScore)) / currStat.mapHistory.stats[map.map._id].numPlayed;
//                     currStat.mapHistory.stats[map.map._id].kills = ((currStat.mapHistory.stats[map.map._id].kills * (currStat.mapHistory.stats[map.map._id].numPlayed - 1)) + parseInt(stat.kills)) / currStat.mapHistory.stats[map.map._id].numPlayed;
//                     currStat.mapHistory.stats[map.map._id].deaths = ((currStat.mapHistory.stats[map.map._id].deaths * (currStat.mapHistory.stats[map.map._id].numPlayed - 1)) + parseInt(stat.deaths)) / currStat.mapHistory.stats[map.map._id].numPlayed;
//                     currStat.mapHistory.stats[map.map._id].assists = ((currStat.mapHistory.stats[map.map._id].assists * (currStat.mapHistory.stats[map.map._id].numPlayed - 1)) + parseInt(stat.assists)) / currStat.mapHistory.stats[map.map._id].numPlayed;

//                     // Get winner for map
//                     // Player in team One
//                     if (match.teamOne.playerIds.indexOf(stat.playerId) != -1) {
//                         if (parseInt(map.teamOneScore) > parseInt(map.teamTwoScore)) {
//                             currStat.mapHistory.stats[map.map._id].winRate = ((currStat.mapHistory.stats[map.map._id].winRate * (currStat.mapHistory.stats[map.map._id].numPlayed - 1)) + 1) / currStat.mapHistory.stats[map.map._id].numPlayed;
//                             currStat.mapHistory.stats[map.map._id].roundsWon += parseInt(map.teamOneScore);
//                             currStat.mapHistory.stats[map.map._id].roundsLost += parseInt(map.teamTwoScore);
//                             mapsWon += 1;
//                         }
//                         if (parseInt(map.teamOneScore) < parseInt(map.teamTwoScore)) {
//                             currStat.mapHistory.stats[map.map._id].winRate = ((currStat.mapHistory.stats[map.map._id].winRate * (currStat.mapHistory.stats[map.map._id].numPlayed - 1))) / currStat.mapHistory.stats[map.map._id].numPlayed;
//                             currStat.mapHistory.stats[map.map._id].roundsWon += parseInt(map.teamOneScore);
//                             currStat.mapHistory.stats[map.map._id].roundsLost += parseInt(map.teamTwoScore);
//                             mapsLost += 1;
//                         }

//                         if (teamOneWin > teamTwoWin) {
//                             currStat.matchHistory.winRate = ((currStat.matchHistory.winRate * currStat.matchHistory.numMatchesPlayed) + 1) / (currStat.matchHistory.numMatchesPlayed + 1)
//                         } else if (teamTwoWin > teamOneWin) {
//                             currStat.matchHistory.winRate = ((currStat.matchHistory.winRate * currStat.matchHistory.numMatchesPlayed)) / (currStat.matchHistory.numMatchesPlayed + 1)
//                         }
//                     }
//                     // Player in team Two
//                     if (match.teamTwo.playerIds.indexOf(stat.playerId) != -1) {
//                         if (parseInt(map.teamOneScore) > parseInt(map.teamTwoScore)) {
//                             currStat.mapHistory.stats[map.map._id].winRate = ((currStat.mapHistory.stats[map.map._id].winRate * (currStat.mapHistory.stats[map.map._id].numPlayed - 1))) / currStat.mapHistory.stats[map.map._id].numPlayed;
//                             currStat.mapHistory.stats[map.map._id].roundsWon += parseInt(map.teamTwoScore);
//                             currStat.mapHistory.stats[map.map._id].roundsLost += parseInt(map.teamOneScore);
//                             mapsLost += 1
//                         }
//                         if (parseInt(map.teamOneScore) < parseInt(map.teamTwoScore)) {
//                             currStat.mapHistory.stats[map.map._id].winRate = ((currStat.mapHistory.stats[map.map._id].winRate * (currStat.mapHistory.stats[map.map._id].numPlayed - 1)) + 1) / currStat.mapHistory.stats[map.map._id].numPlayed;
//                             currStat.mapHistory.stats[map.map._id].roundsWon += parseInt(map.teamTwoScore);
//                             currStat.mapHistory.stats[map.map._id].roundsLost += parseInt(map.teamOneScore);
//                             mapsWon += 1;
//                         }

//                         if (teamOneWin < teamTwoWin) {
//                             currStat.matchHistory.winRate = ((currStat.matchHistory.winRate * currStat.matchHistory.numMatchesPlayed) + 1) / (currStat.matchHistory.numMatchesPlayed + 1)
//                         } else if (teamTwoWin < teamOneWin) {
//                             currStat.matchHistory.winRate = ((currStat.matchHistory.winRate * currStat.matchHistory.numMatchesPlayed)) / (currStat.matchHistory.numMatchesPlayed + 1)
//                         }

//                     }
//                     // console.log(currStat.mapHistory.stats)
//                     if (match.mapIds.indexOf(map._id.toString()) === match.mapIds.length - 1) {
//                         currStat.matchHistory.numMatchesPlayed += 1
//                     }

//                     // Update Match stats (total)
//                     currStat.matchHistory.numMapsPlayed += 1
//                     currStat.matchHistory.avgCombatScore = ((currStat.matchHistory.avgCombatScore * (currStat.matchHistory.numMapsPlayed - 1)) + parseInt(stat.avgCombatScore)) / currStat.matchHistory.numMapsPlayed;
//                     currStat.matchHistory.kills = ((currStat.matchHistory.kills * (currStat.matchHistory.numMapsPlayed - 1)) + parseInt(stat.kills)) / currStat.matchHistory.numMapsPlayed;
//                     currStat.matchHistory.deaths = ((currStat.matchHistory.deaths * (currStat.matchHistory.numMapsPlayed - 1)) + parseInt(stat.deaths)) / currStat.matchHistory.numMapsPlayed;
//                     currStat.matchHistory.assists = ((currStat.matchHistory.assists * (currStat.matchHistory.numMapsPlayed - 1)) + parseInt(stat.assists)) / currStat.matchHistory.numMapsPlayed;

//                     playerStatsTotalService.update(currStat._id, currStat).then(response => { callback() });
//                 })
//             }, (err) => {
//                 if (err) {
//                     console.log('error', err);
//                 } else {
//                     callback()
//                 }
//             })
//         }, function (err, results) {
//             console.log(err)
//         });

//     }
// }
//     // const eventStatsService = context.app.service('api/eventstats');
//     // const eventId = context.params.query.eventId;
//     // let eventStatData = await eventStatsService.find({query:{eventId:eventId}});
//     // let eventStat = eventStatData.data[0]
//     // // Dont process if up to date
//     // if(eventStat.isUpdated){
//     //     context.result = eventStat
//     //     return context
//     // }

//     // let statsData = await playerStatsService.find(context.params);
//     // let stats = statsData.data
//     // let players = {}
//     // let agents = {}

//     // // Compute Stats
//     // for(let i=0;i<stats.length;i++){
//     //     let player = stats[i];
//     //     if(player.deaths === 0){
//     //         continue
//     //     }
//     //     if(players[player.playerId]){
//     //         let tempPlayer = players[player.playerId]
//     //         players[player.playerId] = {
//     //             matches: tempPlayer.matches + 1,
//     //             avgCombatScore: tempPlayer.avgCombatScore + (player.avgCombatScore - tempPlayer.avgCombatScore )/(tempPlayer.matches + 1),
//     //             kills: player.kills + tempPlayer.kills,
//     //             deaths: player.deaths + tempPlayer.deaths,
//     //             assists: player.assists + tempPlayer.assists,
//     //             kd: (player.kills + tempPlayer.kills)/(player.deaths + tempPlayer.deaths)
//     //         }
//     //     }else{
//     //         players[player.playerId] = {
//     //             matches: 1,
//     //             avgCombatScore: player.avgCombatScore,
//     //             kills: player.kills,
//     //             deaths: player.deaths,
//     //             assists: player.assists,
//     //             kd: player.kills/player.deaths
//     //         }
//     //     }
//     //     if(player.agentId){
//     //         if(player.agentId === "5eaa00059aed6018f4efeaf6"){
//     //             console.log(1)
//     //         }
//     //         if(agents[player.agentId]){
//     //             let tempAgent = agents[player.agentId]
//     //             agents[player.agentId] = {
//     //                 matches: tempAgent.matches + 1,
//     //                 avgCombatScore: tempAgent.avgCombatScore + (player.avgCombatScore - tempAgent.avgCombatScore )/(tempAgent.matches + 1),
//     //                 kills: player.kills + tempAgent.kills,
//     //                 deaths: player.deaths + tempAgent.deaths,
//     //                 assists: player.assists + tempAgent.assists,
//     //                 kd: (player.kills + tempAgent.kills)/(player.deaths + tempAgent.deaths)
//     //             }
//     //         } else{
//     //             agents[player.agentId] = {
//     //                 matches: 1,
//     //                 avgCombatScore: player.avgCombatScore,
//     //                 kills: player.kills,
//     //                 deaths: player.deaths,
//     //                 assists: player.assists,
//     //                 kd: player.kills/player.deaths
//     //             }
//     //         }

//     //     }
//     // }
//     // // Convert to array and sort
//     // let playersArray = []
//     // for(key in players){
//     //     let temp = players[key];
//     //     temp.playerId = key;
//     //     playersArray.push(temp)
//     // }
//     // playersArray.sort((a,b)=>{return b.avgCombatScore - a.avgCombatScore})
//     // let agentsArray = []
//     // for(key in agents){
//     //     let temp = agents[key];
//     //     temp.agentId = key;
//     //     agentsArray.push(temp)
//     // }
//     // agentsArray.sort((a,b)=>{return b.avgCombatScore - a.avgCombatScore})
//     // // playersArray = playersArray.slice(0,10);

//     // // Update with player name
//     // const playersService = context.app.service('api/players');
//     // for(let i=0;i<playersArray.length;i++){
//     //     let playerData = await playersService.find({query:{"_id":playersArray[i].playerId}});
//     //     playersArray[i].playerName = playerData.data[0].name;
//     //     playersArray[i].slug = playerData.data[0].slug;
//     //     playersArray[i].img = playerData.data[0].img;
//     // }
//     // // Update with agent name
//     // const agentsService = context.app.service('api/agents');
//     // for(let i=0;i<agentsArray.length;i++){
//     //     let agentData = await agentsService.find({query:{"_id":agentsArray[i].agentId}});
//     //     agentsArray[i].name = agentData.data[0].name;
//     //     agentsArray[i].img = agentData.data[0].img;
//     // }
//     // // console.log(agentsArray)
//     // // update event stat document
//     // eventStat.topPlayers = playersArray;
//     // eventStat.topAgents = agentsArray;
//     // eventStat.isUpdated = true;
//     // await eventStatsService.update(eventStat._id, eventStat)
//     // context.result = eventStat
//     // return context
