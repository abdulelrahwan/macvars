<template>
  <div class="hello">
    <div class="columns is-centered">
      <div class="column is-two-thirds">
        <div class="card" style="padding:50px;text-align:left">
          <div class="card-content">
            <p class="title">Matches</p>
            <b-button @click="addMatch">Add Match</b-button>
            <b-field label="Match ID" style="width:300px">
              <b-input placeholder="ID..." v-model="addEditMatchId"></b-input>
            </b-field>
            <b-button @click="addMatchToEdit">Edit Score of Finishes Match</b-button>
            <b-table
              style="height:15000px;cursor:pointer"
              :paginated="true"
              :per-page="16"
              mobile-cards
              :data="matches"
              :striped="true"
              :hoverable="true"
            >
              <template slot-scope="props">
                <b-table-column searchable label="Team One" field="teamOne.name">
                  <div style="text-align:left" v-for="(map,index) in props.row.maps" :key="index">
                    <div
                      style="margin-top:10px;border-color:black;border-width:2px;border-style:solid"
                    >
                      {{props.row.teamOne.name}}
                      <b-input style="width:100px" v-model="map.teamOneScore"></b-input>
                    </div>
                  </div>
                  <p @click="addMapToMatch(props.row)">Click to add map</p>
                </b-table-column>
                <b-table-column searchable label="Team Two" field="teamTwo.name">
                  <div style="text-align:left" v-for="(map,index) in props.row.maps" :key="index">
                    <div
                      style="margin-top:10px;border-color:black;border-width:2px;border-style:solid;display:inline-block"
                    >
                      {{props.row.teamTwo.name}}
                      <b-input style="width:100px" v-model="map.teamTwoScore"></b-input>
                    </div>
                    <span @click="liveScoreUpdate(map)">update score</span><br/>
                    <span @click="finishmap(map)">finish map</span>
                  </div>
                  <span @click="editMatch(props.row)" style="cursor:pointer">Edit match Details</span>
                </b-table-column>
                <b-table-column label="Map" field="mpa">
                  <div style="text-align:left" v-for="(map,index) in props.row.maps" :key="index">
                    <div
                      style="margin-top:10px;border-color:black;border-width:2px;border-style:solid"
                    >
                      <div v-for="gamemap in gamemaps" :key="gamemap._id">
                        <span v-if="map.map._id === gamemap._id" style="color:red">{{gamemap.name}}</span>
                        <span v-else @click="changeMap(map,gamemap)">{{gamemap.name}}</span>
                      </div>
                    </div>
                  </div>
                </b-table-column>
                <b-table-column label="tba">
                  <div style="text-align:left" v-for="(map,index) in props.row.maps" :key="index">
                    <div
                      style="margin-top:10px;border-color:black;border-width:2px;border-style:solid"
                    >
                      <b-checkbox v-model="map.tba">{{map.tba}}</b-checkbox>
                    </div>
                  </div>
                </b-table-column>
                <b-table-column label="Update Group Points?" field="grp">
                  <b-select v-model="updatePoints" placeholder="Update Group points?">
                    <option value="true">yes</option>
                    <option value="false" defult>no</option>
                  </b-select>
                </b-table-column>
                <!-- <b-table-column label="Update Playoff bracket?" field="grp">
                  <b-select v-model="updatePlayoffs" placeholder="Update Playoff bracket?">
                    <option value="true">yes</option>
                    <option value="false">no</option>
                  </b-select>
                </b-table-column>-->
                <!-- <b-table-column label="Teams decided?" field="grp">
                  <b-select v-model="props.row.teamsDecided" placeholder="Placeholder Match?">
                    <option value="true">yes</option>
                    <option value="false">no</option>
                  </b-select>
                </b-table-column>-->
                <b-table-column label="Active?" field="grp">
                  <b-select v-model="props.row.active" placeholder="Active?">
                    <option value="true">yes</option>
                    <option value="false">no</option>
                  </b-select>
                </b-table-column>
                <b-table-column label="Swap players" field="name">
                  <b-button
                    style="margin-top:20px"
                    @click="swapMatchPlayers(props.row, true)"
                  >Swap post-submission</b-button>
                  <b-button
                    style="margin-top:20px"
                    @click="swapMatchPlayers(props.row, false)"
                  >Swap pre-submission</b-button>
                </b-table-column>
                <b-table-column label="Save" field="name">
                  <b-button style="margin-top:20px" @click="save(props.row)">Save Match</b-button>
                </b-table-column>
              </template>
            </b-table>
            <div>
              <b-select
                placeholder="Select a Match"
                v-model="selectedMatch"
                v-on:input="filterActivePlayers()"
              >
                <option
                  v-for="match in matches"
                  :value="match"
                  style="color:white"
                  :key="match.id"
                >{{ match.teamOne.name }} vs {{match.teamTwo.name}}</option>
              </b-select>
              <b-select placeholder="Select a Match" v-model="selectedMap" v-if="selectedMatch">
                <option
                  v-for="(map,index) in selectedMatch.maps"
                  :value="map._id"
                  style="color:white"
                  :key="index"
                >{{map.map}}</option>
              </b-select>
              {{index}}
            </div>
            <div v-if="selectedMatch" style="margin-top:10px">
              <div v-for="(player,index) in selectedMatch.activePlayers" :key="player">
                <span
                  style="color:#ff4653;cursor:pointer"
                  @click="swapSingle(selectedMatch, map, player)"
                >Click to swap this player</span>
                <br />
                {{player.name}}
                <b-select placeholder="Agent" v-model="getPlayerNum(index).agentId">
                  <option
                    v-for="(agent,index) in agents"
                    :value="agent._id"
                    style="color:white"
                    :key="index"
                  >
                    <div
                      style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                    >
                      <img :src="getAgent(agent.img)" style="border-radius: 50%;" />
                    </div>
                    {{agent.name}}
                  </option>
                </b-select>
                <b-input
                  style="width:80px;display:inline-block;color:white;margin-left:20px"
                  v-model="getPlayerNum(index).avgCombatScore"
                  value="0"
                  placeholder="ACS"
                ></b-input>
                <b-input
                  style="width:80px;display:inline-block;color:white;margin-left:20px"
                  v-model="getPlayerNum(index).kills"
                  placeholder="kills"
                ></b-input>
                <b-input
                  style="width:80px;display:inline-block;color:white;margin-left:20px"
                  v-model="getPlayerNum(index).deaths"
                  placeholder="deaths"
                ></b-input>
                <b-input
                  style="width:80px;display:inline-block;color:white;margin-left:20px"
                  v-model="getPlayerNum(index).assists"
                  placeholder="assists"
                ></b-input>
                <b-input
                  style="width:80px;display:inline-block;color:white;margin-left:20px"
                  v-model="getPlayerNum(index).econRating"
                  placeholder="econ"
                ></b-input>
                <b-input
                  style="width:80px;display:inline-block;color:white;margin-left:20px"
                  v-model="getPlayerNum(index).firstBloods"
                  placeholder="FB"
                ></b-input>
                <b-input
                  style="width:80px;display:inline-block;color:white;margin-left:20px"
                  v-model="getPlayerNum(index).plants"
                  placeholder="plants"
                ></b-input>
                <b-input
                  style="width:80px;display:inline-block;color:white;margin-left:20px"
                  v-model="getPlayerNum(index).defuses"
                  placeholder="defuses"
                ></b-input>
                <div style="width:800px;height:5px;background-color:black;margin-top:5px"></div>
                <br />
              </div>
              <br />

              <p style="color:red;cursor:pointer" @click="saveMatchStats">Click to Save Match</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal :active.sync="addEditMatch" has-modal-card trap-focus>
      <AddEditMatch
        style="overflow: scroll;max-height: 600px;"
        :events="events"
        :teams="teams"
        :passedMatch="match"
        :mode="mode"
      ></AddEditMatch>
    </b-modal>
    <b-modal :active.sync="swapPlayers" has-modal-card trap-focus>
      <SwapPlayers
        style="overflow: scroll;max-height: 800px"
        :match="matchToSwapPlayers"
        :postSubmissionSwap="postSubmissionSwap"
      ></SwapPlayers>
    </b-modal>
    <b-modal :active.sync="swapSinglePlayer" has-modal-card trap-focus>
      <SwapSingle
        style="overflow: scroll;height: 800px"
        :players="players"
        :match="matchToSwapPlayers"
        :playerToSwap="playerToSwap"
        :playerTeamToSwap="playerTeamToSwap"
      ></SwapSingle>
    </b-modal>
  </div>
</template>

<script>
import AddEditMatch from "./AddEditMatch";
import SwapPlayers from "./SwapPlayers";
import SwapSingle from "./SwapSinglePlayer";
export default {
  name: "AdminMatch",
  props: {
    matches: { type: Array },
    teams: { type: Array },
    events: { type: Array },
    players: { type: Array }
  },
  data() {
    return {
      addEditMatchId: "",
      updatePoints: false,
      disableStatsSave: false,
      closeGame: false,
      addEditMatch: false,
      event: undefined,
      selectedMatch: undefined,
      selectedMap: undefined,
      playerStats: [[], []],
      playerOne: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerTwo: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerThree: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerFour: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerFive: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerSix: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerSeven: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerEight: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerNine: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      playerTen: {
        avgCombatScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        econRating: 0,
        firstBloods: 0,
        plants: 0,
        defuses: 0
      },
      agents: [],
      gamemaps: [],
      swapPlayers: false,
      swapSinglePlayer: false,
      playerTeamToSwap: undefined,
      playerToSwap: undefined,
      matchToSwapPlayers: undefined,
      match: {
        teamOneId: "",
        teamTwoId: "",
        type: "",
        maps: [
          {
            mapId: "",
            teamOneScore: "0",
            teamTwoScore: "0",
            playerStats: []
          }
        ],
        dateTime: "",
        event: "",
        active: true,
        hasStats: false,
        commentIds: [],
        activePlayerIds: []
      },
      mode: undefined,
      postSubmissionSwap: false
    };
  },
  created() {
    this.$axios('https://macvars.herokuapp.com/' + "api/gamemaps", {
      method: "get"
    })
      .then(function(response) {
        return response.data;
      })
      .then(response => {
        this.gamemaps = response.data;
      });
    this.$axios('https://macvars.herokuapp.com/' + "api/agents", {
      method: "get"
    })
      .then(function(response) {
        return response.data;
      })
      .then(response => {
        this.agents = response.data;
      });
  },
  methods: {
    finishmap(map) {
      this.$axios('https://macvars.herokuapp.com/' + "api/maps/" + map._id, {
        method: "patch",
        data: { active: false }
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.$buefy.snackbar.open({
            message: "Map sent",
            type: "is-success",
            position: "is-top"
          });
        });
    },
    liveScoreUpdate(map) {
      this.$axios('https://macvars.herokuapp.com/' + "api/maps/" + map._id, {
        method: "patch",
        data: { teamOneScore: map.teamOneScore, teamTwoScore: map.teamTwoScore }
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.$buefy.snackbar.open({
            message: "Score sent",
            type: "is-success",
            position: "is-top"
          });
        });
    },
    mapSelectChanged(match) {
      // for(let i=0;i<this.selectedMatch.maps.length;i++){
      //   console.log(this.selectedMap)
      //   if(this.selectedMap === this.selectedMatch.maps[i]._id){
      //     console.log(this.selectedMatch.maps[i].playerStats)
      //     for(let j=0;j<this.selectedMatch.activePlayers.length;j++){
      //       for(let k=0;k<this.selectedMatch.maps[i].playerStats;k++){
      //         if(this.selectedMatch.maps[i].playerStats[k].playerId ===this.selectedMatch.activePlayers[j]._id ){
      //           console.log(this.selectedMatch.activePlayers[j].name)
      //         }
      //       }
      //       // let stat = this.selectedMatch.maps[i].playerStats.indexOf()
      //       // console.log(this.getPlayerNum(i))
      //     }
      //     break;
      //   }
      // }
    },
    changeMap(map, gamemap) {
      map.mapId = gamemap._id;
      map.map = gamemap;
      // console.log(map)
      // console.log(gamemap)
    },
    getPlayerName(playerId) {
      for (let i = 0; i < this.teams.length; i++) {
        for (let j = 0; j < this.teams[i].players.length; j++) {
          if (this.teams[i].players[j]._id === playerId) {
            return this.teams[i].players[j].name;
          }
        }
      }
    },
    addMapToMatch(match) {
      const map = {
        mapId: "5eac70fb7009411af47aa38d",
        teamOneScore: "0",
        teamTwoScore: "0",
        playerStatIds: []
      };
      this.$axios('https://macvars.herokuapp.com/' + "api/maps", {
        method: "post",
        data: map
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          match.mapIds.push(response._id);
          this.$axios('https://macvars.herokuapp.com/' + "api/matches/" + match._id, {
            method: "patch",
            data: match
          })
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              window.location.reload();
            });
        });
    },
    saveMatchStats() {
      if (this.disableStatsSave) {
        alert(
          "Cannnot save right now. Did you fuck something up when entering fam."
        );
        return;
      }
      this.disableStatsSave = true;
      const statsArray = [];

      this.playerOne.playerId = this.selectedMatch.activePlayers[0]._id;
      this.playerOne.eventId = this.selectedMatch.event;
      this.playerOne.matchId = this.selectedMatch._id;
      if (
        this.selectedMatch.teamOne.playerIds.indexOf(
          this.selectedMatch.activePlayers[0]._id
        ) != -1
      ) {
        this.playerOne.teamId = this.selectedMatch.teamOne._id;
      } else {
        this.playerOne.teamId = this.selectedMatch.teamTwo._id;
      }

      this.playerOne.mapId = this.selectedMap;
      this.$axios('https://macvars.herokuapp.com/' + "api/playerstats", {
        method: "post",
        data: this.playerOne
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          statsArray.push(response._id);
          this.playerTwo.playerId = this.selectedMatch.activePlayers[1]._id;
          this.playerTwo.eventId = this.selectedMatch.event;
          this.playerTwo.matchId = this.selectedMatch._id;
          if (
            this.selectedMatch.teamOne.playerIds.indexOf(
              this.selectedMatch.activePlayers[1]._id
            ) != -1
          ) {
            this.playerTwo.teamId = this.selectedMatch.teamOne._id;
          } else {
            this.playerTwo.teamId = this.selectedMatch.teamTwo._id;
          }
          this.playerTwo.mapId = this.selectedMap;
          this.$axios('https://macvars.herokuapp.com/' + "api/playerstats", {
            method: "post",
            data: this.playerTwo
          })
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              statsArray.push(response._id);
              this.playerThree.playerId = this.selectedMatch.activePlayers[2]._id;
              this.playerThree.eventId = this.selectedMatch.event;
              this.playerThree.matchId = this.selectedMatch._id;
              if (
                this.selectedMatch.teamOne.playerIds.indexOf(
                  this.selectedMatch.activePlayers[2]._id
                ) != -1
              ) {
                this.playerThree.teamId = this.selectedMatch.teamOne._id;
              } else {
                this.playerThree.teamId = this.selectedMatch.teamTwo._id;
              }
              this.playerThree.mapId = this.selectedMap;
              this.$axios('https://macvars.herokuapp.com/' + "api/playerstats", {
                method: "post",
                data: this.playerThree
              })
                .then(function(response) {
                  return response.data;
                })
                .then(response => {
                  statsArray.push(response._id);
                  this.playerFour.playerId = this.selectedMatch.activePlayers[3]._id;
                  this.playerFour.eventId = this.selectedMatch.event;
                  this.playerFour.matchId = this.selectedMatch._id;
                  if (
                    this.selectedMatch.teamOne.playerIds.indexOf(
                      this.selectedMatch.activePlayers[3]._id
                    ) != -1
                  ) {
                    this.playerFour.teamId = this.selectedMatch.teamOne._id;
                  } else {
                    this.playerFour.teamId = this.selectedMatch.teamTwo._id;
                  }
                  this.playerFour.mapId = this.selectedMap;
                  this.$axios('https://macvars.herokuapp.com/' + "api/playerstats", {
                    method: "post",
                    data: this.playerFour
                  })
                    .then(function(response) {
                      return response.data;
                    })
                    .then(response => {
                      statsArray.push(response._id);
                      this.playerFive.playerId = this.selectedMatch.activePlayers[4]._id;
                      this.playerFive.eventId = this.selectedMatch.event;
                      this.playerFive.matchId = this.selectedMatch._id;
                      if (
                        this.selectedMatch.teamOne.playerIds.indexOf(
                          this.selectedMatch.activePlayers[4]._id
                        ) != -1
                      ) {
                        this.playerFive.teamId = this.selectedMatch.teamOne._id;
                      } else {
                        this.playerFive.teamId = this.selectedMatch.teamTwo._id;
                      }
                      this.playerFive.mapId = this.selectedMap;
                      this.$axios('https://macvars.herokuapp.com/' + "api/playerstats", {
                        method: "post",
                        data: this.playerFive
                      })
                        .then(function(response) {
                          return response.data;
                        })
                        .then(response => {
                          statsArray.push(response._id);
                          this.playerSix.playerId = this.selectedMatch.activePlayers[5]._id;
                          this.playerSix.eventId = this.selectedMatch.event;
                          this.playerSix.matchId = this.selectedMatch._id;
                          if (
                            this.selectedMatch.teamOne.playerIds.indexOf(
                              this.selectedMatch.activePlayers[5]._id
                            ) != -1
                          ) {
                            this.playerSix.teamId = this.selectedMatch.teamOne._id;
                          } else {
                            this.playerSix.teamId = this.selectedMatch.teamTwo._id;
                          }
                          this.playerSix.mapId = this.selectedMap;
                          this.$axios('https://macvars.herokuapp.com/' + "api/playerstats", {
                            method: "post",
                            data: this.playerSix
                          })
                            .then(function(response) {
                              return response.data;
                            })
                            .then(response => {
                              statsArray.push(response._id);
                              this.playerSeven.playerId = this.selectedMatch.activePlayers[6]._id;
                              this.playerSeven.eventId = this.selectedMatch.event;
                              this.playerSeven.matchId = this.selectedMatch._id;
                              if (
                                this.selectedMatch.teamOne.playerIds.indexOf(
                                  this.selectedMatch.activePlayers[6]._id
                                ) != -1
                              ) {
                                this.playerSeven.teamId = this.selectedMatch.teamOne._id;
                              } else {
                                this.playerSeven.teamId = this.selectedMatch.teamTwo._id;
                              }
                              this.playerSeven.mapId = this.selectedMap;
                              this.$axios(
                                'https://macvars.herokuapp.com/' + "api/playerstats",
                                {
                                  method: "post",
                                  data: this.playerSeven
                                }
                              )
                                .then(function(response) {
                                  return response.data;
                                })
                                .then(response => {
                                  statsArray.push(response._id);
                                  this.playerEight.playerId = this.selectedMatch.activePlayers[7]._id;
                                  this.playerEight.eventId = this.selectedMatch.event;
                                  this.playerEight.matchId = this.selectedMatch._id;
                                  if (
                                    this.selectedMatch.teamOne.playerIds.indexOf(
                                      this.selectedMatch.activePlayers[7]._id
                                    ) != -1
                                  ) {
                                    this.playerEight.teamId = this.selectedMatch.teamOne._id;
                                  } else {
                                    this.playerEight.teamId = this.selectedMatch.teamTwo._id;
                                  }
                                  this.playerEight.mapId = this.selectedMap;
                                  this.$axios(
                                    'https://macvars.herokuapp.com/' + "api/playerstats",
                                    {
                                      method: "post",
                                      data: this.playerEight
                                    }
                                  )
                                    .then(function(response) {
                                      return response.data;
                                    })
                                    .then(response => {
                                      statsArray.push(response._id);
                                      this.playerNine.playerId = this.selectedMatch.activePlayers[8]._id;
                                      this.playerNine.eventId = this.selectedMatch.event;
                                      this.playerNine.matchId = this.selectedMatch._id;
                                      if (
                                        this.selectedMatch.teamOne.playerIds.indexOf(
                                          this.selectedMatch.activePlayers[8]
                                            ._id
                                        ) != -1
                                      ) {
                                        this.playerNine.teamId = this.selectedMatch.teamOne._id;
                                      } else {
                                        this.playerNine.teamId = this.selectedMatch.teamTwo._id;
                                      }
                                      this.playerNine.mapId = this.selectedMap;
                                      this.$axios(
                                        'https://macvars.herokuapp.com/' + "api/playerstats",
                                        {
                                          method: "post",
                                          data: this.playerNine
                                        }
                                      )
                                        .then(function(response) {
                                          return response.data;
                                        })
                                        .then(response => {
                                          statsArray.push(response._id);
                                          this.playerTen.playerId = this.selectedMatch.activePlayers[9]._id;
                                          this.playerTen.eventId = this.selectedMatch.event;
                                          this.playerTen.matchId = this.selectedMatch._id;
                                          if (
                                            this.selectedMatch.teamOne.playerIds.indexOf(
                                              this.selectedMatch
                                                .activePlayers[9]._id
                                            ) != -1
                                          ) {
                                            this.playerTen.teamId = this.selectedMatch.teamOne._id;
                                          } else {
                                            this.playerTen.teamId = this.selectedMatch.teamTwo._id;
                                          }
                                          this.playerTen.mapId = this.selectedMap;
                                          this.$axios(
                                            'https://macvars.herokuapp.com/' +
                                              "api/playerstats",
                                            {
                                              method: "post",
                                              data: this.playerTen
                                            }
                                          )
                                            .then(function(response) {
                                              return response.data;
                                            })
                                            .then(response => {
                                              statsArray.push(response._id);
                                              let maptoUpdate;
                                              for (
                                                let i = 0;
                                                i <
                                                this.selectedMatch.maps.length;
                                                i++
                                              ) {
                                                if (
                                                  this.selectedMatch.maps[i]
                                                    ._id === this.selectedMap
                                                ) {
                                                  maptoUpdate = this
                                                    .selectedMatch.maps[i];
                                                  break;
                                                }
                                              }
                                              maptoUpdate.playerStatIds = statsArray;
                                              this.$axios(
                                                'https://macvars.herokuapp.com/' +
                                                  "api/maps/" +
                                                  maptoUpdate._id,
                                                {
                                                  method: "patch",
                                                  data: maptoUpdate
                                                }
                                              )
                                                .then(function(response) {
                                                  return response.data;
                                                })
                                                .then(response => {
                                                  window.location.reload();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    getPlayerNum(index) {
      if (index === 0) {
        return this.playerOne;
      }
      if (index === 1) {
        return this.playerTwo;
      }
      if (index === 2) {
        return this.playerThree;
      }
      if (index === 3) {
        return this.playerFour;
      }
      if (index === 4) {
        return this.playerFive;
      }
      if (index === 5) {
        return this.playerSix;
      }
      if (index === 6) {
        return this.playerSeven;
      }
      if (index === 7) {
        return this.playerEight;
      }
      if (index === 8) {
        return this.playerNine;
      }
      if (index === 9) {
        return this.playerTen;
      }
    },
    getPlayerNumTwo(index) {
      if (index === 0) {
        return this.playerSix;
      }
      if (index === 1) {
        return this.playerSeven;
      }
      if (index === 2) {
        return this.playerEight;
      }
      if (index === 3) {
        return this.playerNine;
      }
      if (index === 4) {
        return this.playerTen;
      }
    },
    save(match) {
      if (this.updatePoints === "true") {
        let teamOne = "";
        let teamTwo = "";
        let winner;
        let loser;
        if (this.getWinnerDetails(match.maps).winner === 0) {
          teamOne = "winner";
          teamTwo = "loser";
          winner = match.teamOne;
          loser = match.teamTwo;
        } else {
          teamOne = "loser";
          teamTwo = "winner";
          winner = match.teamTwo;
          loser = match.teamOne;
        }
        winner.eventStats[match.event].points += 3;
        winner.eventStats[match.event].groupStageWins++;
        loser.eventStats[match.event].groupStageLoses++;

        for (let i = 0; i < match.maps.length; i++) {
          if (teamOne === "loser") {
            console.log("");
            console.log("SCORE", match.maps[i].teamTwoScore);
            loser.eventStats[match.event].groupStageRoundsWon += parseInt(
              match.maps[i].teamOneScore
            );
            loser.eventStats[match.event].groupStageRoundsLost += parseInt(
              match.maps[i].teamTwoScore
            );

            winner.eventStats[match.event].groupStageRoundsWon += parseInt(
              match.maps[i].teamTwoScore
            );
            winner.eventStats[match.event].groupStageRoundsLost += parseInt(
              match.maps[i].teamOneScore
            );
          } else {
            loser.eventStats[match.event].groupStageRoundsWon += parseInt(
              match.maps[i].teamTwoScore
            );
            loser.eventStats[match.event].groupStageRoundsLost += parseInt(
              match.maps[i].teamOneScore
            );

            winner.eventStats[match.event].groupStageRoundsWon += parseInt(
              match.maps[i].teamOneScore
            );
            winner.eventStats[match.event].groupStageRoundsLost += parseInt(
              match.maps[i].teamTwoScore
            );
          }
        }

        // Update event stat for team if they won
        this.$axios('https://macvars.herokuapp.com/' + "api/teams/" + winner._id, {
          method: "patch",
          data: winner
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            if (response.code !== undefined) {
              this.$buefy.snackbar.open(response.message);
            } else {
              // window.location.reload();
            }
          });
        this.$axios('https://macvars.herokuapp.com/' + "api/teams/" + loser._id, {
          method: "patch",
          data: loser
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            if (response.code !== undefined) {
              this.$buefy.snackbar.open(response.message);
            } else {
              // window.location.reload();
            }
          });
      }
      this.$axios('https://macvars.herokuapp.com/' + "api/matches/" + match._id, {
        method: "patch",
        data: match
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          if (response.code !== undefined) {
            this.$buefy.snackbar.open(response.message);
          } else {
          }
        });
      for (let i = 0; i < match.maps.length; i++) {
        this.$axios('https://macvars.herokuapp.com/' + "api/maps/" + match.maps[i]._id, {
          method: "patch",
          data: match.maps[i]
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            if (response.code !== undefined) {
              this.$buefy.snackbar.open(response.message);
            } else {
              if (i + 1 == match.maps.length - 1) {
                this.$buefy.snackbar.open({
                  message: "Data Saved! Refresh to view updated.",
                  type: "is-success",
                  position: "is-top"
                });
              }
            }
          });
      }
    },
    getWinnerDetails(maps) {
      const details = {};
      if (maps.length === 1) {
        details.teamOneScore = maps[0].teamOneScore;
        details.teamTwoScore = maps[0].teamTwoScore;
        if (parseInt(details.teamOneScore) > parseInt(details.teamTwoScore)) {
          details.winner = 0;
        } else {
          details.winner = 1;
        }
      } else {
        let oneCount = 0;
        let twoCount = 0;
        for (let i = 0; i < maps.length; i++) {
          if (parseInt(maps[i].teamOneScore) > parseInt(maps[i].teamTwoScore)) {
            oneCount += 1;
          } else {
            twoCount += 1;
          }
        }
        details.teamOneScore = oneCount;
        details.teamTwoScore = twoCount;
        if (oneCount > twoCount) {
          details.winner = 0;
        } else {
          details.winner = 1;
        }
      }
      return details;
    },
    findChildPlayoffMatch(match, eventID) {
      this.$axios(
        'https://macvars.herokuapp.com/' +
          "api/events/" +
          eventID +
          "/?&populateteams=true&populatematches=true",
        {
          method: "get",
          headers: {
            "content-type": "application/json"
          }
        }
      )
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          if (response.code !== undefined) {
            this.$buefy.snackbar.open(response.message);
          } else {
            this.event = response;
            for (let i = 0; i < this.event.playoffs.length; i++) {
              for (let j = 0; j < this.event.playoffs[i].games.length; j++) {
                if (this.event.playoffs[i].games[j].match1ID === match._id) {
                  this.updatePlayoffMatch(
                    this.event.playoffs[i].games[j].matchID,
                    0,
                    this.getWinnerDetails(match.maps),
                    match
                  );
                }
                if (this.event.playoffs[i].games[j].match2ID === match._id) {
                  this.updatePlayoffMatch(
                    this.event.playoffs[i].games[j].matchID,
                    1,
                    this.getWinnerDetails(match.maps),
                    match
                  );
                }
              }
            }
          }
        });
    },
    updatePlayoffMatch(childID, number, winnerDetails, match) {
      let update = {};
      if (number === 0 && winnerDetails.winner === 0) {
        update = { teamOneId: match.teamOneId };
      } else if (number === 1 && winnerDetails.winner === 0) {
        update = { teamTwoId: match.teamOneId };
      } else if (number === 0 && winnerDetails.winner === 1) {
        update = { teamOneId: match.teamTwoId };
      } else {
        update = { teamTwoId: match.teamTwoId };
      }
      this.$axios('https://macvars.herokuapp.com/' + "api/matches/" + childID, {
        method: "patch",
        data: update
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          if (response.code !== undefined) {
            this.$buefy.snackbar.open(response.message);
          } else {
          }
        });
    },
    getAgent(img) {
      if (img) {
        return 'https://macvars.herokuapp.com/' + `api/uploads/agents/${img}`;
      } else {
        return 'https://macvars.herokuapp.com/' + `api/uploads/agents/unknown.png`;
      }
    },
    filterActivePlayers() {
      if (this.selectedMatch.activePlayerIds !== undefined) {
        this.selectedMatch.teamOne.playerIds = this.selectedMatch.teamOne.playerIds.filter(
          player => {
            return this.selectedMatch.activePlayerIds.includes(player);
          }
        );
        this.selectedMatch.teamTwo.playerIds = this.selectedMatch.teamTwo.playerIds.filter(
          player => {
            return this.selectedMatch.activePlayerIds.includes(player);
          }
        );
      }
    },
    swapMatchPlayers(match, postSubmissionSwap) {
      this.matchToSwapPlayers = match;
      this.swapPlayers = true;
      this.postSubmissionSwap = postSubmissionSwap;
    },
    swapSingle(match, map, player) {
      this.matchToSwapPlayers = match;
      this.swapSinglePlayer = true;
      this.playerToSwap = player;
      if (this.selectedMatch.teamOne.playerIds.indexOf(player._id) != -1) {
        this.playerTeamToSwap = this.selectedMatch.teamOne;
      } else {
        this.playerTeamToSwap = this.selectedMatch.teamTwo;
      }
    },
    editMatch(match) {
      this.match = match;
      this.mode = "edit";
      this.addEditMatch = true;
    },
    addMatch(match) {
      this.match = match;
      this.mode = "add";
      this.addEditMatch = true;
    },
    addMatchToEdit() {
      this.$axios(
        'https://macvars.herokuapp.com/' +
          `api/matches/${this.addEditMatchId}?$sort[dateTime]=-1&populatemaps=true&populatematchplayers=true`,
        {
          method: "get",
          headers: {
            "content-type": "application/json"
          }
        }
      )
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.matches.push(response);
          alert("match added");
        });
    }
  },
  components: { AddEditMatch, SwapPlayers, SwapSingle }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
