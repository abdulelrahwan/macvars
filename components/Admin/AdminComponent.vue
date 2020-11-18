<template>
  <div class="hello" v-if="authenticated">
    <h1 style="font-size:50px;margin-bottom:20px">Admin</h1>
    <div class="columns is-centered">
      <div class="column is-two-thirds">
        <div class="card" style="padding:50px;text-align:left">
          <div class="card-content">
            <p class="title">Players</p>
            <b-button @click="addPlayer">Add Player</b-button>
            <b-table
              style="height:600px;cursor:pointer"
              :paginated="true"
              :per-page="10"
              mobile-cards
              :data="players"
              :striped="true"
              :hoverable="true"
              @click="(row)=>editPlayer(row)"
            >
              <template slot-scope="props">
                <b-table-column searchable label="IGN" field="name">
                  <div style="text-align:left">{{props.row.name}}</div>
                </b-table-column>
                <b-table-column label="First Name" field="name">
                  <div style="text-align:left">{{props.row.realName.first}}</div>
                </b-table-column>
                <b-table-column label="Last Name" field="name">
                  <div style="text-align:left">{{props.row.realName.last}}</div>
                </b-table-column>
                <b-table-column label="Twitter" field="name">
                  <div style="text-align:left">{{props.row.socials.twitter}}</div>
                </b-table-column>
                <b-table-column label="Twitch" field="name">
                  <div style="text-align:left">{{props.row.socials.twitch}}</div>
                </b-table-column>
                <b-table-column label="Nationality" field="name">
                  <div style="text-align:left">{{props.row.nationality}}</div>
                </b-table-column>
                <b-table-column label="Team" field="name">
                  <div style="text-align:left">{{props.row.team}}</div>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
    <Teams :players="players" :teams="teams" :events="eventsObj" />
    <Events :events="events" :teamsObj="teamsObj" :teams="teams" />
    <Matches :matches="matches" :teams="teams" :events="events" :players="players" />
    <b-modal :active.sync="addEditPlayers" has-modal-card trap-focus>
      <AddEditPlayers :passedPlayer="player" :mode="mode"></AddEditPlayers>
    </b-modal>
  </div>
</template>

<script>
import AddEditPlayers from "./Players/AddEditPlayers";
import Teams from "./Teams/Teams";
import Events from "./Events/Events";
import Matches from "./Matches/Matches";
export default {
  name: "Admin",
  props: {
    type: String
  },
  data() {
    return {
      authenticated: false,
      addEditPlayers: false,
      mode: "",
      players: [],
      teams: [],
      events: [],
      matches: [],
      eventsObj: {},
      teamsObj: {},
      player: {
        name: "",
        realName: {
          first: "",
          last: ""
        },
        nationality: "",
        socials: {
          twitter: "",
          twitch: ""
        },
        files: [],
        team: " ",
        img: ""
      }
    };
  },
  mounted() {
    if (process.browser) {
      this.$aes.setKey("SECURE_VAL_PW");
      var authEnc = localStorage.getItem("auth");
      if (authEnc) {
        let auth = JSON.parse(this.$aes.decrypt(authEnc));
        if (!auth || auth.permissions.indexOf("admin") === -1) {
          this.$router.push({ path: `/` });
        } else {
          this.authenticated = true;
        }
      }
    }
    this.fetchPlayers(0);
    this.fetchTeams(0);
    this.fetchEvents(0);
    this.fetchMatches(0);
  },
  methods: {
    fetchPlayers(skip) {
      this.$axios('https://macvars.herokuapp.com/' + `api/players?$skip=${skip}`, {
        method: "get"
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.players.push(...response.data);
          if (response.total > response.limit && skip < response.total) {
            skip = skip + response.limit;
            this.fetchPlayers(skip);
          }
        });
    },
    fetchTeams(skip) {
      this.$axios('https://macvars.herokuapp.com/' + `api/teams?$skip=${skip}`, {
        method: "get"
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.teams.push(...response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.teamsObj[response.data[i]._id] = response.data[i];
          }
          if (response.total > response.limit && skip < response.total) {
            skip = skip + response.limit;
            this.fetchTeams(skip);
          }
        });
    },
    fetchEvents(skip) {
      this.$axios(
        'https://macvars.herokuapp.com/' +
          `api/events?$skip=${skip}&populateteams=true&populatematches=true&active=true`,
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
          this.events.push(...response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.eventsObj[response.data[i]._id] = response.data[i];
          }
          if (response.total > response.limit && skip < response.total) {
            skip = skip + response.limit;
            this.fetchEvents(skip);
          }
        });
    },
    fetchMatches(skip) {
      this.$axios(
        'https://macvars.herokuapp.com/' +
          `api/matches?$sort[dateTime]=-1&$skip=${skip}&active=true&populatemaps=true&populatematchplayers=true`,
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
          this.matches.push(...response.data);
          if (response.total > response.limit && skip < response.total) {
            skip = skip + response.limit;
            this.fetchMatches(skip);
          }
        });
    },
    editPlayer(player) {
      this.player = player;
      this.mode = "edit";
      this.addEditPlayers = true;
    },
    addPlayer(player) {
      this.player = player;
      this.mode = "add";
      this.addEditPlayers = true;
    }
  },
  components: { AddEditPlayers, Teams, Events, Matches }
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
