<template>
  <div :style="{width:!$device.isMobile?'800px':'' }">
    <div class="card" style="margin-top:20px;">
      <div class="card-content">
        <div class="media">
          <div class="media-left has-text-center">
            <figure class="image is-128x128">
              <img style="border-radius: 50%;" :src="getImgUrl(player.img)" />
            </figure>
            <p class="title">
              <CountryFlag
                v-if="player.flag !== undefined"
                v-bind:country="player.flag"
                size="normal"
                style="vertical-align:-12.5px; margin-left:-20px; margin-right:-15px;"
              />
              <CountryFlag
                v-if="player.flag === undefined"
                v-bind:country="'ca'"
                size="normal"
                style="vertical-align:-12.5px; margin-left:-20px; margin-right:-15px;"
              />
              {{player.name}}
            </p>
          </div>
          <div class="media-content">
            <p class="title">{{player.realName.first + " " + player.realName.last}}</p>
            <a
              :href="player.socials.twitch"
              v-if="player.socials.twitch !== ''"
              target="_blank"
              rel="noopener noreferrer"
              style="margin-right:5px;color:#ff726f"
            >
              <i class="fab fa-twitch fa-2x"></i>
            </a>
            <a
              :href="player.socials.twitter"
              v-if="player.socials.twitter !== ''"
              target="_blank"
              style="color:#ff726f"
              rel="noopener noreferrer"
            >
              <i class="fab fa-twitter-square fa-2x"></i>
            </a>
            <div class="box" style="margin-top: 0.5em">
              <div class="columns">
                <div class="column">
                  <small>Points</small>
                  <p class="title is-4">{{Math.floor(Math.random() * 35)}}.{{Math.floor(Math.random() * 99)}}</p>
                </div>
                <div class="column">
                  <small>Assists</small>
                  <p class="title is-4">{{Math.floor(Math.random() * 12)}}.{{Math.floor(Math.random() * 99)}}</p>
                </div>
                <div class="column">
                  <small>Rebounds</small>
                  <p class="title is-4">>{{Math.floor(Math.random() * 15)}}.{{Math.floor(Math.random() * 99)}}</p>
                </div>
                <div class="column">
                  <small>Turnovers</small>
                  <p class="title is-4">>{{Math.floor(Math.random() * 5)}}.{{Math.floor(Math.random() * 99)}}</p>
                </div>
                <div class="column">
                  <small>Minutes/Game</small>
                  <p class="title is-4">{{Math.floor(Math.random() * 12)}}.{{Math.floor(Math.random() * 99)}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
            <p class="title is-4">Match History (per quarter)</p>
              <p
                style="font-size:11px;text-align:right"
              >Click on a row to check out the player's total statline in that game</p>
              <b-table
                :data="playerStatsHistory"
                :mobile-cards="false"
                style="font-size:14px;cursor:pointer;"
                selectable
                @select="selected"
                :striped="true"
                :hoverable="true"
                :paginated="true" 
                :per-page="10"
              >
              <template slot-scope="props">
                <b-table-column
                  field="date"
                  label="Date"
                >{{ formatDate(props.row.match.dateTime)}}</b-table-column>
                <b-table-column field="points" label="Points" numeric>
                  {{Math.floor(Math.random() * 40)}}
                </b-table-column>
                <b-table-column
                  field="assists" label="Assists" numeric
                >{{Math.floor(Math.random() * 15)}}</b-table-column>
                <b-table-column
                  field="rebounds" label="Rebounds" numeric
                >{{Math.floor(Math.random() * 15)}}</b-table-column>
                <b-table-column field="Team" label="Team">
                  <div v-if="props.row.teamId === props.row.match.teamOne._id">
                    <p>{{props.row.match.teamOne.name}}</p>
                  </div>
                  <div v-if="props.row.teamId === props.row.match.teamTwo._id">
                    <p>{{props.row.match.teamTwo.name}}</p>
                  </div>
                </b-table-column>
                <b-table-column field="Opponent" label="Opponent">
                  <div v-if="props.row.teamId !== props.row.match.teamOne._id">
                    <p>{{props.row.match.teamOne.name}}</p>
                  </div>
                  <div v-if="props.row.teamId !== props.row.match.teamTwo._id">
                    <p>{{props.row.match.teamTwo.name}}</p>
                  </div>
                </b-table-column>
              </template>
            </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import flagOptions from "../../../assets/flags/flags.json";
const moment = require("moment");
import CountryFlag from "vue-country-flag";
import axios from "axios";
export default {
  name: "Players",
  props: {
    type: String
  },
  asyncData({ params }) {
    return axios
      .all([
        axios.get('https://macvars.herokuapp.com/' + `api/players/${params.id}`),
        axios.get('https://macvars.herokuapp.com/' + `api/gamemaps`),
        axios.get('https://macvars.herokuapp.com/' + "api/events"),
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/playerStats/?playerId=${params.id}&populatematch=true&populateagent=true&populatemap=true`
        ),
      ]).then(axios.spread(async (playerRaw, gamemapsRaw, eventsRaw, playerStatsHistoryRaw) => {
        return { player: playerRaw.data, playerStatsHistory: playerStatsHistoryRaw.data.data.reverse() } 
      }))
  },
  created() {
    // let teamIds = this.teamStats.map(team => team.team_oid);
    // let teamRequests = [];
    // for (let i = 0; i < teamIds.length; i++) {
    //   let newRequest = axios({method: 'get', url: 'https://macvars.herokuapp.com/' + `api/teams/${teamIds[i]}`})
    //   teamRequests.push(newRequest);
    // }

    // axios.all(teamRequests).then((...teamResponses) => {
    //   let teamRespData = teamResponses[0]
    //   for(let i = 0; i < this.teamStats.length; i++) {
    //     this.teamStats[i].logo = teamRespData[i].data.img
    //   }
    // })
  },
  methods: {
    getImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/players/${img}`;
    },
    getAgent(img) {
      if (img) {
        return 'https://macvars.herokuapp.com/' + `api/uploads/agents/${img}.png`;
      } else {
        return 'https://macvars.herokuapp.com/' + `api/uploads/agents/unknown.png`;
      }
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MMMM DD, YYYY");
    },
    getTeamImg(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${img}`;
    },
    selected(item) {
      this.$router.push({
        path: `/matches/${item.matchId}/${item.match.slug}`
      });
    }
  },
  components: {CountryFlag}
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
.numberCircle {
  font-size: 5rem;
  width: 100px;
  height: 100px;

  background-color: green;
  color: white;
  padding: 1rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  font: 32px Arial, sans-serif;
}

.box {
  background-color: #273142;
}
</style>
