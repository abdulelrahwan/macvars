<template>
  <div class="hello">
    <h1 style="font-size:50px;margin-bottom:20px">Matches</h1>
    <div class="columns is-centered">
     
      <div class="column is-narrow" style="padding:0px">
        <div :style="{width:!$device.isMobile?'800px':'' }">
        <div class="columns" style="margin-top:10px;">
          <div class="column is-full" style="">
            <div v-if="matches.length !=0">
              <p style="text-align:left;margin-top:10px; margin-left:20px">Upcoming/Live Matches</p>
              <div
                class="card"
                v-for="(match, index) in matches"
                :key="match.id"
                v-bind:class="getBkg(index%2===0)"
                style="cursor:pointer;margin-top:10px;"
              >
              <nuxt-link :to="`/matches/${match._id}/${match.slug}`" style="padding:0px;color:white">
                <div class="card-content" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                  <div class="columns is-mobile">
                    <div class="column is-3" style="opacity:0.6;margin-left:-10px">{{formatDate(match.dateTime)}}</div>
                    <div class="column is-4-mobile" style="text-align:right">
                      <div
                        style="overflow:hidden;text-overflow: ellipsis;display:inline-block;"
                      >{{match.teamOne.name}}</div>
                      <div
                        style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                      >
                        <img
                          :src="getTeamImgUrl(match.teamOne.img)"
                          alt="Smiley face"
                        />
                      </div>
                    </div>
                    <div class="column is-narrow">
                      <span v-if="!isLive(match)" style="display:inline-block">vs.</span>
                      <span
                        v-if="isLive(match)"
                        style="text-align:center;font-weight:bold;"
                        v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 0)"
                      >{{getWinnerDetails(match).teamOneScore}}</span>
                      <span v-if="isLive(match)" style="display:inline-block">-</span>
                      <span
                        v-if="isLive(match)"
                        style="text-align:center;font-weight:bold;display:inline-block"
                        v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 1)"
                      >{{getWinnerDetails(match).teamTwoScore}}</span>
                    </div>
                    <div class="column is-4-mobile" style="text-align:left">
                      <div
                        style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                      >
                        <img
                          :src="getTeamImgUrl(match.teamTwo.img)"
                          alt="Smiley face"
                        />
                      </div>
                      <div
                        style="overflow:hidden;text-overflow: ellipsis;display:inline-block;width:60%"
                      >{{match.teamTwo.name}}</div>
                    </div>
                    <div
                      v-if="!$device.isMobile"
                      class="column"
                      style="opacity:0.6;overflow:hidden;text-overflow: ellipsis;white-space: nowrap"
                    >{{events[match.event].name}}</div>
                  </div>
                </div>
              </nuxt-link>
              </div>
              <div class="columns is-centered is-mobile">
                <div class="column is-full" style="padding-right:11px;margin-top:5px">
                  <div class="card" v-if="matches.length != matchesTotal">
                    <div
                      class="card-content"
                      style="color:#ff726f;cursor:pointer;padding-top: 0.5rem; padding-bottom: 0.5rem"
                      @click="matchesSkip+=5;fetchMatches(true,matchesSkip)"
                    >Show More</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p style="text-align:left; margin-left:20px">Finished Matches</p>
        <div class="columns" style="margin-top:10px;" v-if="finishedMatches.length != 0">
          <div class="column is-full">
            <div
              class="card"
              v-for="(match, index) in finishedMatches"
              :key="match.id"
              v-bind:class="getBkg(index%2===0)"
              style="cursor:pointer;margin-top:10px;"
            >
            <nuxt-link :to="`/matches/${match._id}/${match.slug}`" style="padding:0px;color:white">
              <div class="card-content" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <div class="columns is-mobile">
                  <div class="column is-3" style="opacity:0.6;margin-left:-10px">{{formatDate(match.dateTime)}}</div>
                  <div class="column is-4-mobile" style="text-align:right">
                    <div
                      style="overflow:hidden;text-overflow: ellipsis;display:inline-block;"
                    >{{match.teamOne.name}}</div>
                    <div
                      style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                    >
                      <img
                        :src="getTeamImgUrl(match.teamOne.img)"
                        alt="Smiley face"
                      />
                    </div>
                  </div>
                  <div class="column is-narrow">
                    <span
                      style="text-align:center;font-weight:bold;"
                      v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 0)"
                    >{{getWinnerDetails(match).teamOneScore}}</span>
                    <span style="display:inline-block">-</span>
                    <span
                      style="text-align:center;font-weight:bold;display:inline-block"
                      v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 1)"
                    >{{getWinnerDetails(match).teamTwoScore}}</span>
                  </div>
                  <div class="column is-4-mobile" style="text-align:left">
                    <div
                      style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                    >
                      <img
                        :src="getTeamImgUrl(match.teamTwo.img)"
                        alt="Smiley face"
                      />
                    </div>
                    <div
                      style="overflow:hidden;text-overflow: ellipsis;display:inline-block;width:60%"
                    >{{match.teamTwo.name}}</div>
                  </div>
                  <div
                  v-if="!$device.isMobile"
                    class="column"
                    style="opacity:0.6;overflow:hidden;text-overflow: ellipsis;white-space: nowrap"
                  >{{events[match.event].name}}</div>
                </div>
              </div>
            </nuxt-link>
            </div>
            <div class="columns is-mobile is-centered">
              <div class="column" style="padding-right:11px;margin-top:5px">
                <div class="card" v-if="finishedMatches.length != finishedMatchesTotal">
                  <div
                    class="card-content"
                    style="color:#ff726f;cursor:pointer;padding-top: 0.5rem; padding-bottom: 0.5rem"
                    @click="finishedMatchesSkip+=5;fetchMatches(false,finishedMatchesSkip)"
                  >Show More</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import axios from "axios";
const moment = require("moment");
export default {
  name: "Characters",
  props: {
    type: String
  },
  asyncData() {
    //start vars
    var data = [];
    var matches = [];
    var finishedMatches = [];
    var events = {};
    var matchesSkip = 0;
    var finishedMatchesSkip = 0;
    var matchesTotal = 0;
    var finishedMatchesTotal = 0;
    //end vars
    return axios
      .all([
        axios.get('https://macvars.herokuapp.com/' + `api/events/?active=true`),
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/matches?$sort[dateTime]=1&$limit=5&$skip=${matchesSkip}&active=true&teamsDecided=true&populatemapsonly=true`
        ),
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/matches?$sort[dateTime]=-1&$limit=5&$skip=${finishedMatchesSkip}&active=false&teamsDecided=true&populatemapsonly=true`
        )
      ])
      .then(
        axios.spread((eventsRaw, matchesRaw, finishedMatchesRaw) => {
          //process events
          let eventsData = eventsRaw.data.data;
          for (let i = 0; i < eventsData.length; i++) {
            events[eventsData[i]._id] = eventsData[i];
          }
          //process matches
          let matchesData = matchesRaw.data;
          matchesTotal = matchesData.total;
          matches.push(...matchesData.data);
          //process finished matches
          let finishedMatchesData = finishedMatchesRaw.data;
          finishedMatchesTotal = finishedMatchesData.total;
          finishedMatches.push(...finishedMatchesData.data);
          return {
            data,
            matches,
            finishedMatches,
            events,
            matchesSkip,
            finishedMatchesSkip,
            matchesTotal,
            finishedMatchesTotal
          };
        })
      )
      .catch(err => console.log(err));
  },
  methods: {
    navEventDetails(id, slug) {
      this.$router.push({ path: `/events/${id}/${slug}` });
    },
    fetchMatches(active, skip) {
      let sort = 1;
      if (!active) {
        sort = -1;
      }
      this.$axios(
        'https://macvars.herokuapp.com/' +
          `api/matches?$sort[dateTime]=${sort}&$limit=5&$skip=${skip}&active=${active}&teamsDecided=true&populatemapsonly=true`,
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
          if (active) {
            this.matchesTotal = response.total;
            this.matches.push(...response.data);
          } else {
            this.finishedMatchesTotal = response.total;

            this.finishedMatches.push(...response.data);
          }
        });
    },
    navMatch(id, slug) {
      this.$router.push({ path: `/matches/${id}/${slug}` });
    },
    navMatchTab(id, slug, event) {
      let route = this.$router.resolve({
        path: `/matches/${id}/${slug}`
      });
      window.open(route.href, "_blank");
    },
    getTeamImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${img}`;
    },
     getWinnerDetails(match) {
       let maps = match.maps
      const details = {};
      let oneCount = 0;
      let twoCount = 0;
      for (let i = 0; i < maps.length; i++) {
        // if (
        //   (maps[i].active === false && parseInt(maps[i].teamOneScore) > parseInt(maps[i].teamTwoScore))
        // ) {
          oneCount += parseInt(maps[i].teamOneScore);
          twoCount += parseInt(maps[i].teamTwoScore);
        // } else if (
        //     (maps[i].active === false && parseInt(maps[i].teamOneScore) < parseInt(maps[i].teamTwoScore)) || (
        //   parseInt(maps[i].teamOneScore) < parseInt(maps[i].teamTwoScore) &&
        //   parseInt(maps[i].teamTwoScore) === 13)
        // ) {
        //   twoCount += 1;
        // }
      }
      details.teamOneScore = oneCount;
      details.teamTwoScore = twoCount;
      // if(this.match.defaultWin){
      //   details.teamOneScore += this.match.defaultWin.teamOneScore;
      //     details.teamTwoScore += this.match.defaultWin.teamTwoScore;
      // }
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
    getBkg(type) {
      if (type) {
        return "light-bkg";
      } else {
        return "dark-bkg";
      }
    },
    isLive(match) {
      if (moment(new Date()).diff(moment(match.dateTime)) <= 0) {
        return false;
      } else {
        return true;
      }
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MM/DD h:mm a");
    }
  },
  components: { }
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
.loser {
  color: orangered;
}
.winner {
  color: lightgreen;
}
.light-bkg {
}
.dark-bkg {
  background-color: #1a212e;
}
</style>
