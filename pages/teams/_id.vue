<template>
  <div class="home">
    <div :style="{width:!$device.isMobile?'800px':'' }">
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-128x128">
                <img style="border-radius: 50%;" :src="getImgUrl()" />
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <p class="title">{{ team.name }}</p>
                <p>Latest match: {{ matchHistory[0] ? timeDiff(matchHistory[0].dateTime) : 'N/A'  }} ago</p>
              </div>
            </div>
            <div class="media-right">
              <CountryFlag
                  :country="team.flag != null ? team.flag : 'ca'"
                  size="big"
                />
            </div>
          </div>
          <b-tabs type="is-boxed" v-if="isPageReady">
            <b-tab-item label="Overview">
              <!--Roster-->
              <div class="columns ">
                <div class="column is-one-fifth" v-for="player in team.activePlayers" :key="player._id">
                    <nuxt-link :to="`/players/${player._id}`">
                    <div
                      class="card"
                      :style="{height:!$device.isMobile?'175px':'105px','cursor':'pointer'}"
                    >
                      <div
                        :style="{height:!$device.isMobile?'125px':'70px','width':'100%','display':'flex','overflow':'hidden','justify-content':'center'}"
                      >
                        <img
                          :src="getPlayerImgUrl(player.img)"
                          style="max-height: 100%"
                        />
                        <div style="position: absolute; z-index: 1 ; top: 0px; right: -8px">
                          <CountryFlag
                              v-if="player.flag !== undefined"
                              v-bind:country="player.flag"
                              size="medium"
                            />
                            <CountryFlag
                              v-if="player.flag === undefined"
                              country="us"
                              size="small"
                              style="visibility:hidden;margin-right:-20px"
                            />
                        </div>
                      </div>
                      <footer class="card-footer">
                        <div class="card-footer-item">
                          <p>{{player.name}}</p>
                        </div>
                      </footer>
                    </div>
                  </nuxt-link>
                </div>
              </div>
              <div>Quarter Stats Winrate</div>
              <div style="margin-top:20px">
                  <div class="box" v-for="map in mapHistory" :key="map._id" style="background-color: #273142; margin-top: 0.5em; margin-bottom: 0.5em;">
                    <div class="media">
                      <div class="media-left has-text-centered">
                        <p>{{map.name}}</p>
                      </div>
                      <div class="media-content">
                        <div class="content has-text-centered">
                          <div v-if="mapHistory[0].stats !== undefined">
                            <strong class="title is-4" style="color: white">{{map.stats ? (map.stats['Win %'].toFixed(2) * 100) : 'N/A'}}%</strong>
                            <p>{{map.stats ? map.stats['Maps Played'] : 'N/A' }} games</p>
                          </div>
                          <strong v-else class="title is-4">{{Math.floor(Math.random() *100)}}%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </b-tab-item>
            <!-- <b-tab-item label="Stats">
              <p class="title is-4 has-text-left">Player Stats</p>
              <b-table
                ref="element"
                style="color:white"
                :mobile-cards="false"
                :data="playerStats"
                default-sort="ValRating"
                default-sort-direction="desc"
                :striped="true"
                :hoverable="true"
                v-if="playerStats !== undefined && playerStats.length > 0"
              >
                <template slot-scope="props">
                  <b-table-column
                    label="Name"
                    field="Player"
                    style="width:150px"
                  >
                    <div>
                      <CountryFlag v-bind:country="props.row.country_code" size="normal" style="vertical-align:-13.5px; margin-left:-20px; margin-right:-15px" />
                      <nuxt-link
                        :to="`/players/${props.row.player_oid}/${props.row.Player}`"
                        style="padding:0px;color:white"
                      >
                      {{props.row.Player}}
                      </nuxt-link>
                    </div>
                  </b-table-column>
                  <b-table-column label="Top Agents" field="agents">
                    <img v-for="agent in props.row['Top 3 Agents']" :key="agent" :src="getAgent(agent.Agent.toLowerCase())" alt="Agent Name" style="border-radius:50%; height: 25px; width: 25px">
                  </b-table-column>
                  <b-table-column sortable label="Rating" field="ValRating">
                    <div
                      :style="props.row.ACS>1?'color:limegreen':'color:orangered'"
                    >{{props.row.ValRating.toFixed(2)}}</div>
                  </b-table-column>
                  <b-table-column label="ACS" field="ACS">
                    <div
                      style="text-align:left"
                      v-if="props.row.ACS"
                    >{{(props.row.ACS).toFixed(2)}}</div>
                  </b-table-column>
                  <b-table-column label="K/D" field="kd">
                    <div
                      v-if="props.row['K/D']"
                    >{{(props.row['K/D']).toFixed(2)}}</div>
                  </b-table-column>
                  <b-table-column label="Kills" field="Total Kills">
                    <div>{{(props.row['Total Kills'])}}</div>
                  </b-table-column>
                  <b-table-column label="Deaths" field="Total Deaths">
                    <div
                    >{{(props.row['Total Deaths'])}}</div>
                  </b-table-column>
                  <b-table-column label="Assists" field="Total Assists">
                    <div
                    >{{(props.row['Total Assists'])}}</div>
                  </b-table-column>
                </template>
              </b-table>
              <p class="title is-5" v-if="playerStats === undefined || playerStats.length === 0">Data Unavailable</p>
              <p class="title is-4 has-text-left">Stats per Map</p>
              <b-table
                style="color:white"
                :mobile-cards="false"
                :data="mapHistory"
                default-sort="ValRating"
                default-sort-direction="desc"
                :striped="true"
                :hoverable="true"
              >
                <template slot-scope="props">
                  <b-table-column label="Map" field="name" >
                    {{ props.row.name !== undefined ? props.row.name : 'N/A' }}
                  </b-table-column>
                  <b-table-column label="Win %" field="Win %" >
                    {{ props.row.stats ? (props.row.stats['Win %'].toFixed(2) * 100) : 'N/A' }}
                  </b-table-column>
                  <b-table-column label="Rating" field="ValRating" >
                    <div :style="props.row.stats ? props.row.stats['ValRating'] : null>1?'color:limegreen':'color:orangered'">{{ props.row.stats ? (props.row.stats['ValRating'].toFixed(2)) : 'N/A' }}</div>
                  </b-table-column>
                  <b-table-column label="ACS" field="ACS" >
                    {{ props.row.stats ? (props.row.stats['ACS'].toFixed(2)) : 'N/A'}}
                  </b-table-column>
                  <b-table-column label="Econ" field="Econ Rating" >
                    {{ props.row.stats ? (props.row.stats['Econ Rating'].toFixed(2)) : 'N/A' }}
                  </b-table-column>
                  <b-table-column label="Kills" field="Total Kills" >
                    {{ props.row.stats ? props.row.stats['Total Kills'] : 'N/A' }}
                  </b-table-column>
                  <b-table-column label="Deaths" field="Total Deaths" >
                    {{ props.row.stats ? props.row.stats['Total Deaths'] : 'N/A' }}
                  </b-table-column>
                  <b-table-column label="K/D" field="K/D" >
                    {{ props.row.stats ? (props.row.stats['K/D'].toFixed(2)) : 'N/A' }}
                  </b-table-column>
                  <b-table-column label="K/R" field="K/R" >
                    {{ props.row.stats ? (props.row.stats['K/R'].toFixed(2)) : 'N/A' }}
                  </b-table-column>
                  <b-table-column label="D/R" field="D/R" >
                    {{ props.row.stats ? (props.row.stats['D/R'].toFixed(2)) : 'N/A' }}
                  </b-table-column>
                  <b-table-column label="FB/R" field="FB/R" >
                    {{ props.row.stats ? (props.row.stats['FB/R'].toFixed(2)) : 'N/A' }}
                  </b-table-column>
                </template>
              </b-table>
              <p class="title is-5" v-if="mapHistory === undefined">Data Unavailable</p>
              <div class="is-flex" style="justify-content: space-between; align-items: center">
                <p class="title is-4" style="padding-top: 0.5em">Stats per Agent</p>
                <b-dropdown v-model="agentStatsFilter" aria-role="list">
                  <button class="button" type="button" slot="trigger">
                    <template>
                      <span>{{ agentStatsMapIndex[agentStatsFilter].map }}</span>
                    </template>
                    <b-icon icon="menu-down"></b-icon>
                  </button>
                  <b-dropdown-item v-for="mapInd in agentStatsMapIndex" :key="mapInd.id" :value="mapInd.id" aria-role="listitem">
                    <div>{{ mapInd.map }}</div>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <client-only v-if="allAgentStats !== undefined">
                <b-table
                  style="color:white"
                  :mobile-cards="false"
                  :data="allAgentStats[agentStatsFilter]"
                  default-sort="ValRating"
                  default-sort-direction="desc"
                  :striped="true"
                  :hoverable="true"
                >
                  <template slot-scope="props">
                    <b-table-column label="Agent" field="Agent" >
                      <div style="width:100px">
                      <img :src="getAgent(props.row.Agent.toLowerCase())" alt="Agent Name" style="border-radius:50%; height: 25px; width: 25px">
                      <span style="vertical-align: top">{{ props.row.Agent }}</span>
                      </div>
                    </b-table-column>
                    <b-table-column label="Win %" field="Win %">
                     {{ props.row['Win %'] ? (props.row['Win %'] * 100).toFixed(2) : 'N/A' }}
                    </b-table-column>
                    <b-table-column label="Rating" field="ValRating" sortable >
                      <div :style="props.row['ValRating']>1?'color:limegreen':'color:orangered'">{{ props.row['ValRating'] ? (props.row['ValRating'].toFixed(2)) : 'N/A' }}</div>
                    </b-table-column>
                    <b-table-column label="ACS" field="ACS" >
                      {{ props.row['ACS'] ? (props.row['ACS'].toFixed(2)) : 'N/A' }}
                    </b-table-column>
                    <b-table-column label="Econ" field="Econ Rating" >
                      {{ props.row['Econ Rating'] ? (props.row['Econ Rating'].toFixed(2)) : 'N/A' }}
                    </b-table-column>
                    <b-table-column label="Kills" field="Total Kills" >
                      {{ props.row['Total Kills'] ? props.row['Total Kills'] : 'N/A' }}
                    </b-table-column>
                    <b-table-column label="Deaths" field="Total Deaths" >
                      {{ props.row['Total Deaths'] ? props.row['Total Deaths'] : 'N/A' }}
                    </b-table-column>
                    <b-table-column label="K/D" field="K/D" >
                      {{ props.row['K/D'] ? (props.row['K/D'].toFixed(2)) : 'N/A' }}
                    </b-table-column>
                    <b-table-column label="K/R" field="K/R" >
                      {{ props.row['K/R'] ? (props.row['K/R'].toFixed(2)) : 'N/A' }}
                    </b-table-column>
                    <b-table-column label="D/R" field="D/R" >
                      {{ props.row['D/R'] ? (props.row['D/R'].toFixed(2)) : 'N/A' }}
                    </b-table-column>
                  </template>
                </b-table>
              </client-only>
            </b-tab-item> -->
            <b-tab-item label="Matches">
              <div
                v-for="(match, index) in matchHistoryFinal.slice(0, 3)"
                :key="index"
                style="margin-top: 0.5em; margin-bottom: 0.5em;"
              >
                <div class="box" style="background-color: #273142">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-64x64">
                        <img :src="getTeamImg(match.opponent.img)" style="border-radius: 50%;" alt="Avatar">
                      </figure>
                    </div>
                    <div class="media-content" style="padding:10px;cursor:pointer" @click="navMatch(match._id)">
                      <p>
                        <strong style="color: white">{{match.opponent.name}}</strong>
                      </p>
                      <div v-if="match.isWinner" style="color:green">WON</div>
                      <div v-else style="color:red">LOST</div>
                      
                      <div class="is-flex" style="flex-wrap: wrap">
                        <div class="has-text-centered" v-for="playedMap in match.playedMaps" :key="playedMap.mapId" style="margin: 0.5em">
                          <p>{{ playedMap.map.name }}</p>
                          <p>{{ playedMap.teamOneScore }} - {{ playedMap.teamTwoScore }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="media-right">
                      <strong style="color: white" v-if="match.playedMaps.length == 1">Bo1</strong>
                      <strong style="color: white" v-if="match.playedMaps.length > 1 && match.playedMaps.length < 3">Bo3</strong>
                    </div>
                  </div>
                </div>
              </div>
              <b-table style="color:white" :mobile-cards="false" :data="matchHistoryFinal.slice(3)" :striped="true" :hoverable="true" :paginated="true" :per-page="5" selectable @select="selected">
                <template slot-scope="props">
                  <b-table-column label="Team" field="name">
                    <img :src="getTeamImg(props.row.opponent.img)" alt="Opponent Image" style="border-radius: 50%; width: 25px; height: 25px">
                    <span style="vertical-align: top">{{props.row.opponent.name}}</span>
                  </b-table-column>
                  <b-table-column label="Outcome" field="outcome">
                    <div v-if="props.row.isWinner" style="color:green">WON</div>
                    <div v-else style="color:red">LOST</div>
                  </b-table-column>
                  <b-table-column label="Maps" field="maps">
                    <div style="is-flex">
                      <div v-for="playedMap in props.row.playedMaps" :key="playedMap.mapId">
                        <p>{{ playedMap.map.name }}: {{ playedMap.teamOneScore }} - {{ playedMap.teamTwoScore }}</p>
                      </div>
                    </div>
                  </b-table-column>
                </template>
              </b-table>
            </b-tab-item>
            <b-tab-item label="Players">
              <p class="title is-4">Current Roster</p>
              <!--Roster-->
              <div class="columns" v-if="team.activePlayers !== undefined && team.activePlayers.length > 0">
                <div class="column is-one-fifth" v-for="player in team.activePlayers" :key="player._id">
                  <nuxt-link :to="`/players/${player._id}`">
                    <div
                      class="card"
                      :style="{height:!$device.isMobile?'175px':'105px','cursor':'pointer'}"
                    >
                      <div
                        :style="{height:!$device.isMobile?'125px':'70px','width':'100%','display':'flex','overflow':'hidden','justify-content':'center'}"
                      >
                        <img
                          :src="getPlayerImgUrl(player.img)"
                          style="max-height: 100%"
                        />
                        <div style="position: absolute; z-index: 1 ; top: 0px; right: -8px">
                          <CountryFlag
                              v-if="player.flag !== undefined"
                              v-bind:country="player.flag"
                              size="medium"
                            />
                            <CountryFlag
                              v-if="player.flag === undefined"
                              country="us"
                              size="small"
                              style="visibility:hidden;margin-right:-20px"
                            />
                        </div>
                      </div>
                      <footer class="card-footer">
                        <div class="card-footer-item">
                          <p>{{player.name}}</p>
                        </div>
                      </footer>
                    </div>
                  </nuxt-link>
                </div>
              </div>
              <p class="title is-5" v-if="team.activePlayers === undefined || team.activePlayers.length === 0">Data Unavailable</p>
              <p class="title is-4">All Players</p>
              <div class="columns is-multiline" v-if="team.players !== undefined && team.players.length > 0">
                <div class="column is-one-fifth" v-for="player in team.players" :key="player._id">
                  <nuxt-link :to="`/players/${player._id}`">
                    <div
                      class="card"
                      :style="{height:!$device.isMobile?'175px':'105px','cursor':'pointer'}"
                    >
                      <div
                        :style="{height:!$device.isMobile?'125px':'70px','width':'100%','display':'flex','overflow':'hidden','justify-content':'center'}"
                      >
                        <img
                          :src="getPlayerImgUrl(player.img)"
                          style="max-height: 100%"
                        />
                        <div style="position: absolute; z-index: 1 ; top: 0px; right: -8px">
                          <CountryFlag
                              v-if="player.flag !== undefined"
                              v-bind:country="player.flag"
                              size="medium"
                            />
                            <CountryFlag
                              v-if="player.flag === undefined"
                              country="us"
                              size="small"
                              style="visibility:hidden;margin-right:-20px"
                            />
                        </div>
                      </div>
                      <footer class="card-footer">
                        <div class="card-footer-item">
                          <p>{{player.name}}</p>
                        </div>
                      </footer>
                    </div>
                  </nuxt-link>
                </div>
              </div>
              <p class="title is-5" v-if="team.players === undefined || team.players.length === 0">Data Unavailable</p>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const moment = require("moment");
import EventCard from "../../components/EventCard";
import axios from "axios";
import CountryFlag from "vue-country-flag";

export default {
  name: "Characters",
  props: {
    type: String
  },
  data() {
    return {
      matchHistoryFinal: [],
      agentStatsFilter: 0,
      isPageReady: false,
      allAgentStats: undefined,
      agentStatsMapIndex: [
        { id: 0, map: 'All' },
        { id: 1, map: 'Haven' },
        { id: 2, map: 'Bind' },
        { id: 3, map: 'Split' },
        { id: 4, map: 'Ascent' },
      ]
    };
  },
  asyncData({ params }) {
    return axios.all([
      axios.get('https://macvars.herokuapp.com/' + `api/teams/${params.id}`),
      axios.get('https://macvars.herokuapp.com/' + "api/events?$sort[date.to]=-1", { params: {teamIds: params.id } }),
      axios.get('https://macvars.herokuapp.com/' + `api/gamemaps`),
      axios.get('https://macvars.herokuapp.com/' +
            `api/matches?active=false&$or[0][teamOneId][$in]=${params.id}&$or[1][teamTwoId][$in]=${params.id}&$sort[dateTime]=-1&populatemapsonly=true`)
    ]).then(axios.spread(async (teamRaw, eventsRaw, gamemapsRaw, matchHistoryRaw) => {
      let team = teamRaw.data;
      console.log('team ', team)
      let teamEvents = eventsRaw.data.data;
      let mapHistory = gamemapsRaw.data.data;
      let matchHistory = matchHistoryRaw.data.data
      // let mapIds = mapHistory.map(map => {
      //   return map._id
      // })

      // let mapRequests = [];

      // for (let i = 0; i < mapIds.length; i++) {
      //   let newRequest = axios({method: 'post', url: 'https://macvars.herokuapp.com/' + `api/db/teamstats`, data: { filters: `team_oids=>'{${params.id}}',gamemap_oids=>'{${mapIds[i]}}'` } })
      //   mapRequests.push(newRequest);
      // }

      // let data = await axios.all([
      //   // axios.post('https://macvars.herokuapp.com/' + `api/db/playerstats`, { filters: `team_oids=>'{${params.id}}'` }),
      //   axios.get('https://macvars.herokuapp.com/' +
      //       `api/matches?active=false&$or[0][teamOneId][$in]=${params.id}&$or[1][teamTwoId][$in]=${params.id}&$sort[dateTime]=-1&populatemapsonly=true`),
      //   // ...mapRequests
      // ]).then(axios.spread((matchHistoryRaw) => {
      //   // let mapStats = mapResponses.map(res => res.data[0]);
      //   // for(let i = 0; i < mapHistory.length; i++) {
      //   //   mapHistory[i].stats = mapStats[i];
      //   // }
      //   return { matchHistory: matchHistoryRaw.data.data }
      // }))

      return { team, teamEvents, mapHistory, matchHistory}
    }))
  },
  created() {
    // // pulling agent stats
    // let agentRequests = [];
    // let mapIds = this.mapHistory.map(map => {
    //   return map._id
    // })
    // agentRequests.push(axios({method: 'post', url: 'https://macvars.herokuapp.com/' + `api/db/agentstats`, data: { filters: `team_oids=>'{${this.$route.params.id}}'` } }))
    // for (let i = 0; i < mapIds.length; i++) {
    //   let newRequest = axios({method: 'post', url: 'https://macvars.herokuapp.com/' + `api/db/agentstats`, data: { filters: `team_oids=>'{${this.$route.params.id}}',gamemap_oids=>'{${mapIds[i]}}'` } })
    //   agentRequests.push(newRequest);
    // }
    // axios.all(agentRequests).then(axios.spread((...agentStatsResponses) => {
    //   this.allAgentStats = agentStatsResponses.map(res => res.data);
    // }))
    this.processMatchHistory(this.matchHistory);
    setTimeout(()=>{
      this.isPageReady = true;
      }, 1000);
  },
  methods: {
    getAgent(img) {
      if (img) {
        return 'https://macvars.herokuapp.com/' + `api/uploads/agents/${img}.png`;
      } else {
        return 'https://macvars.herokuapp.com/' + `api/uploads/agents/unknown.png`;
      }
    },
    timeDiff(matchTime) {
      let now = moment(moment.now());
      let then = moment(matchTime);
      
      var ms = now.diff(then);
      var d = moment.duration(ms).humanize();
      
      return d;

    },
    getImgUrl() {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${this.team.img}`;
    },
    getTeamImg(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${img}`;
    },
    getPlayerImgUrl(playerId) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/players/${playerId}`;
    },
    getMapImg(name) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/maps/${name}`;
    },
    navPlayer(id, slug) {
      this.$router.push({ path: `/players/${id}/${slug}` });
    },
    navMatch(id, slug) {
      this.$router.push({ path: `/matches/${id}/${slug}` });
    },
    processMatchHistory(matches) {
      for (let i = 0; i < matches.length; i++) {
        const data = {};
        data._id = matches[i]._id;
        data.slug = matches[i].slug;
        if (matches[i].teamOneId === this.$route.params.id) {
          data.opponent = matches[i].teamTwo;
          data.isWinner = this.getWinnerDetails(matches[i].maps).winner === 0;
          data.playedMaps = matches[i].maps;
        } else {
          data.opponent = matches[i].teamOne;
          data.isWinner = this.getWinnerDetails(matches[i].maps).winner === 1;
          data.playedMaps = matches[i].maps;
        }
        this.matchHistoryFinal.push(data);
      }
    },
    getWinnerDetails(maps) {
      const details = {};
      if (maps.length === 1) {
        details.teamOneScore = maps[0].teamOneScore;
        details.teamTwoScore = maps[0].teamTwoScore;
        if (parseInt(details.teamOneScore) > parseInt(details.teamTwoScore)) {
          details.winner = 0;
        } else if (
          parseInt(details.teamOneScore) < parseInt(details.teamTwoScore)
        ) {
          details.winner = 1;
        } else {
          details.winner = -1;
        }
      } else {
        let oneCount = 0;
        let twoCount = 0;
        for (let i = 0; i < maps.length; i++) {
          if (parseInt(maps[i].teamOneScore) > parseInt(maps[i].teamTwoScore)) {
            oneCount += 1;
          }
          if (parseInt(maps[i].teamOneScore) < parseInt(maps[i].teamTwoScore)) {
            twoCount += 1;
          }
        }
        details.teamOneScore = oneCount;
        details.teamTwoScore = twoCount;
        if (oneCount > twoCount) {
          details.winner = 0;
        } else if (oneCount < twoCount) {
          details.winner = 1;
        } else {
          details.winner = -1;
        }
      }
      return details;
    },
    selected(item) {
      console.log(item)
      this.$router.push({
        path: `/matches/${item._id}/${item.slug}`
      });
    }
  },
  components: { EventCard, CountryFlag }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.type-button {
  width: 150px;
}
.button {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
