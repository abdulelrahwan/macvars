<template>
  <div class="main">
    <div class="columns is-centered ordered-mobile">
      <div class="column is-narrow fl-2">
        <div :style="{width:!$device.isMobile?'200px':'' }">
                      <div
            style="text-align:left;margin-top:20px"
            class="subtitle"
            v-if="liveMatches && liveMatches.length!=0"
          >Live Matches</div>
          <div class="card" style="padding:0px;" v-if="liveMatches && liveMatches.length!=0">
            <div class="card-content" style="padding:0px;">
              <b-menu>
                <b-menu-list style="text-align:left" v-for="match in liveMatches" :key="match._id">
                  <b-menu-item
                    style="text-align:left;overflow:hidden;text-overflow: ellipsis;border-bottom-color:#171e29;border-bottom-height:1px;border-bottom-style:solid"
                  >
                    <template slot="label">
                      <nuxt-link :to="`/matches/${match._id}/${match.slug}`" style="padding:0px">
                        <div class="columns is-mobile">
                          <div class="column is-4" style="padding-right:0px; margin-right:0px">
                            <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Soccerball.svg/1024px-Soccerball.svg.png"
                            style="width:20px;height:20px;float:right; padding-right:0px; margin-right:0px"/>
                          </div>
                          <div v-if="match._id == '5ef16284df57101c2c72ee2d'" class="column is-8"> 
                            <p style="text-align:left">Girls soccer</p>  
                          </div>
                          <div v-if="match._id != '5ef16284df57101c2c72ee2d'" class="column is-8"> 
                            <p style="text-align:left">Boys soccer</p>  
                          </div>
                        </div>
                        <div class="columns is-mobile">
                          <div class="column is-6">
                            <div>
                              <div
                                style="width:20px;height:20px;overflow: hidden;display:inline-block;vertical-align:middle"
                              >
                                <img :src="getTeamImgUrl(match.teamOne.img)" style align="top" />
                              </div>
                              <div
                                style="text-align:left;display:inline-block;margin-bottom:10px;margin-left:5px;width:50%;white-space: nowrap;"
                              >
                                <b style="font-size:14px;">{{match.teamOne.name}}</b>
                              </div>
                            </div>
                            <div style="margin-top:5px">
                              <div
                                style="width:20px;height:20px;overflow: hidden;display:inline-block;vertical-align:middle"
                              >
                                <img :src="getTeamImgUrl(match.teamTwo.img)" style align="top" />
                              </div>
                              <div
                                style="text-align:left;display:inline-block;margin-left:5px;width:50%;white-space: nowrap;"
                              >
                                <b style="font-size:14px">{{match.teamTwo.name}}</b>
                              </div>
                            </div>
                          </div>
                          <div class="column">
                            <div style="text-align:right;">
                              <div
                                v-bind:class="getOutcomeClassLive(getWinnerDetails(match).winner === 0)"
                              >
                                <!-- <span
                                  v-bind:class="getMapClass(getLastMapScore(match.maps).teamOneScore, getLastMapScore(match.maps).teamTwoScore)"
                                  v-if="match.maps && match.maps.length>1"
                                >{{getWinnerDetails(match).teamOneScore}}</span> -->
                                <span v-if="match.maps && match.maps.length>1">(</span>
                                {{getWinnerDetails(match).teamOneScore}}
                                <span v-if="match.maps && match.maps.length>1">)</span>
                              </div>
                              <div
                                style="margin-top:10px"
                                v-bind:class="getOutcomeClassLive(getWinnerDetails(match).winner === 1)"
                              >
                                <!-- <span
                                  v-bind:class="getMapClass(getLastMapScore(match.maps).teamTwoScore, getLastMapScore(match.maps).teamOneScore)"
                                  v-if="match.maps && match.maps.length>1"
                                >{{getLastMapScore(match.maps).teamTwoScore}}</span> -->
                                <span v-if="match.maps && match.maps.length>1">(</span>
                                {{getWinnerDetails(match).teamTwoScore}}
                                <span v-if="match.maps && match.maps.length>1">)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </nuxt-link>
                    </template>
                  </b-menu-item>
                </b-menu-list>
              </b-menu>
            </div>
          </div>
          <div
            style="text-align:left;margin-top:20px"
            class="subtitle"
            v-if="matches && matches.length==0"
          >No upcoming matches</div>
          <div
            style="text-align:left;margin-top:20px"
            class="subtitle"
            v-if="matches && matches.length!=0"
          >Upcoming Matches</div>
          <div class="card" v-if="matches && matches.length!=0" style="padding:0px;">
            <div class="card-content" style="padding:0px">
              <b-menu>
                <b-menu-list style="text-align:left" v-for="match in matches" :key="match._id">
                  <b-menu-item
                    style="text-align:left;overflow:hidden;text-overflow: ellipsis;border-bottom-color:#171e29;border-bottom-height:1px;border-bottom-style:solid"
                  >
                    <template slot="label">
                      <nuxt-link :to="`/matches/${match._id}/${match.slug}`" style="padding:0px">
                        <div class="columns is-mobile">
                          <div class="column is-8">
                            <div style="text-align:left">
                              <div
                                style="width:20px;height:20px;overflow: hidden;display:inline-block;vertical-align:middle"
                              >
                                <img :src="getTeamImgUrl(match.teamOne.img)" style align="top" />
                              </div>
                              <div
                                style="text-align:left;display:inline-block;margin-left:5px;width:50%;white-space: nowrap;"
                              >
                                <b style="font-size:14px">{{match.teamOne.name}}</b>
                              </div>
                            </div>
                            <div style="margin-top:10px">
                              <div
                                style="width:20px;height:20px;overflow: hidden;display:inline-block;vertical-align:middle"
                              >
                                <img :src="getTeamImgUrl(match.teamTwo.img)" style align="top" />
                              </div>
                              <div
                                style="text-align:left;display:inline-block;margin-left:5px;width:50%;white-space: nowrap;"
                              >
                                <b style="font-size:14px;">{{match.teamTwo.name}}</b>
                              </div>
                            </div>
                          </div>
                          <div class="column">
                            <div style="text-align:right;vertical-align:middle">
                              <div style="font-size:13px;margin-top:5px">{{getDay(match.dateTime)}}</div>
                              <div
                                style="font-size:13px;margin-top:10px"
                              >{{formatDate(match.dateTime)}}</div>
                            </div>
                          </div>
                        </div>
                      </nuxt-link>
                    </template>
                  </b-menu-item>
                </b-menu-list>
              </b-menu>
            </div>
          </div>
          <div
            style="text-align:left;margin-top:20px"
            class="subtitle"
            v-if="finishedMatches && finishedMatches.length!=0"
          >Results</div>
          <div class="card" style="padding:0px;" v-if="finishedMatches && finishedMatches.length!=0">
            <div class="card-content" style="padding:0px;">
              <b-menu>
                <b-menu-list
                  style="text-align:left"
                  v-for="match in finishedMatches"
                  :key="match._id"
                >
                  <b-menu-item
                    style="text-align:left;overflow:hidden;text-overflow: ellipsis;border-bottom-color:#171e29;border-bottom-height:1px;border-bottom-style:solid"
                  >
                    <template slot="label">
                      <nuxt-link :to="`/matches/${match._id}/${match.slug}`" style="padding:0px">
                        <div class="columns is-mobile">
                          <div class="column is-two-thirds">
                            <div
                              v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 0)"
                            >
                              <div
                                style="width:20px;height:20px;overflow: hidden;display:inline-block;vertical-align:middle"
                              >
                                <img :src="getTeamImgUrl(match.teamOne.img)" style align="top" />
                              </div>
                              <div
                                style="text-align:left;display:inline-block;margin-bottom:10px;margin-left:5px;width:50%;white-space: nowrap;"
                              >
                                <b style="font-size:14px;">{{match.teamOne.name}}</b>
                              </div>
                            </div>
                            <div
                              style="margin-top:5px"
                              v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 1)"
                            >
                              <div
                                style="width:20px;height:20px;overflow: hidden;display:inline-block;vertical-align:middle"
                              >
                                <img :src="getTeamImgUrl(match.teamTwo.img)" style align="top" />
                              </div>
                              <div
                                style="text-align:left;display:inline-block;margin-left:5px;width:50%;white-space: nowrap;"
                              >
                                <b style="font-size:14px">{{match.teamTwo.name}}</b>
                              </div>
                            </div>
                          </div>
                          <div class="column">
                            <div style="text-align:right;">
                              <div
                                v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 0)"
                              >{{getWinnerDetails(match).teamOneScore}}</div>
                              <div
                                style="margin-top:10px"
                                v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 1)"
                              >{{getWinnerDetails(match).teamTwoScore}}</div>
                            </div>
                          </div>
                        </div>
                      </nuxt-link>
                    </template>
                  </b-menu-item>
                </b-menu-list>
              </b-menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const moment = require("moment");
import axios from "axios";
export default {
  name: "sidematches",
  props: {
    type: String
  },
  data(){
      return {
          finishedMatches: [],
          liveMatches: [],
          matches: []
      }
  },
  mounted() {
    return axios
      .all([
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/matches?$sort[dateTime]=1&$limit=10&$skip=0&active=true&teamsDecided=true&populatemapsonly=true`,
          { headers: { "content-type": "application/json" } }
        ),
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/matches?$sort[dateTime]=-1&$limit=5&$skip=0&active=false&teamsDecided=true&populatemapsonly=true`,
          { headers: { "content-type": "application/json" } }
        )
      ])
      .then(
        axios.spread((matches, activeMatches) => {
          let oldMatches = [];
          let liveMatches = [];
          let matchData = matches.data.data;
          for (let i = 0; i < matchData.length; i++) {
            if (moment(new Date()).diff(moment(matchData[i].dateTime)) <= 0) {
              oldMatches.push(matchData[i]);
            } else {
              liveMatches.push(matchData[i]);
            }
          }
          this.finishedMatches = activeMatches.data.data;
          this.matches = oldMatches;
          this.liveMatches = liveMatches;
        })
      )
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    navEventDetails(id) {
      this.$router.push({ path: `/events/${id}` });
    },
    navMatch(id, slug) {
      this.$router.push({ path: `/matches/${id}/${slug}` });
    },
    navNews(id, slug) {
      this.$router.push({ path: `/news/${id}/${slug}` });
    },
    getImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/news/${img}`;
    },
    getDay(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MMM DD");
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("H:mm");
    },
    getTeamImgUrl(teamId) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${teamId}`;
    },
    getLastMapScore(maps) {
      let details = {};
      for (let i = 0; i < maps.length; i++) {
        if (
          maps[i].active === undefined || (
          parseInt(maps[i].teamOneScore) !== 13 &&
          parseInt(maps[i].teamTwoScore) !== 13)
        ) {
          return {
            teamOneScore: maps[i].teamOneScore,
            teamTwoScore: maps[i].teamTwoScore
          };
        }
      }
      return {
        teamOneScore: 0,
        teamTwoScore: 0
      };
    },
     getWinnerDetails(match) {
       let maps = match.maps
      const details = {};
      let oneCount = 0;
      let twoCount = 0;
      for (let i = 0; i < maps.length; i++) {
        oneCount += parseInt(maps[i].teamOneScore);
        twoCount += parseInt(maps[i].teamTwoScore);
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
    
    return details;
    },
    getOutcomeClass(winner) {
      if (!winner) {
        return "loser";
      } else {
        return "winner";
      }
    },
    getOutcomeClassLive(winner) {
      if (!winner) {
        return "loser-live";
      } else {
        return "winner-live";
      }
    },
    getMapClass(scoreOne, scoreTwo) {
      if (scoreOne > scoreTwo) {
        return "regular";
      } else if (scoreTwo > scoreOne) {
        return "regular";
      } else {
        return "regular";
      }
    },
    formatDateEvent(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MMMM DD, YYYY");
    }
  },
  components: {  }
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
.char-card {
  cursor: pointer;
  padding: 10px;
}
.box {
  width: 220px;
  height: 266px;
}
@media screen and (max-width: 640px) {
  .main {
    height: 100%;
  }
  .hide-img {
    display: none;
  }
}
@media screen and (min-width: 640px) {
  .main {
    height: 100vh;
  }
}
.subtitle {
  margin-bottom: 5px;
  font-size: 16px;
}
.winner {
}
.loser {
  opacity: 0.4;
}
.winner-live {
  color: lightgreen;
}
.loser-live {
  color: orangered;
}
.regular {
  color: white;
}
@media screen and (min-width: 640px) {
  .main {
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
}
@media screen and (max-width: 640px) {
  .main {
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
@media screen and (max-width: 769px) {
  .ordered-mobile {
    display: flex;
    flex-flow: column;
  }
  .ordered-mobile .fl-1 {
    order: 1;
  }
  .ordered-mobile .fl-2 {
    order: 2;
  }
  .ordered-mobile .fl-3 {
    order: 3;
  }
}
</style>
