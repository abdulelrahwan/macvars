<template>
  <div class="modal-card" style="width:800px;">
    <section class="info-tiles" style="margin-top:50px">
      <article class="tile is-child box">
        <b-field label="Team One" v-if="mode !== 'edit'">
          <b-autocomplete
            v-model="searchOne"
            :data="filteredDataObjOne"
            placeholder="Team One"
            @select="option => {match.teamOneId = option._id;getTeam(1, match.teamOneId);searchOne=option.name}"
          >
            <template slot-scope="props">
              <div>{{props.option.name}}</div>
            </template>
            <template slot="empty">No results found</template>
          </b-autocomplete>
          <!-- <b-select v-model="match.teamOneId" expanded placeholder="Select Team One"  v-on:input="getTeam(1, match.teamOneId)">
            <option v-for="team in teams" :value="team._id" :key="team._id">{{ team.name }}</option>
          </b-select>-->
        </b-field>
        <b-field label="Players" v-if="teamOne !== undefined && mode !== 'edit'">
          {{teamOne.name}}
          <b-select expanded v-model="teamOne.activePlayers" multiple placeholder="Select Players">
            <option v-for="option in teamOne.players" :value="option" :key="option._id">
              <span>
                {{ option.name }}
                <p v-if="!teamOne.activePlayerIds.includes(option._id)">(sub)</p>
              </span>
            </option>
          </b-select>
        </b-field>
        <b-field label="Team Two" v-if="mode !== 'edit'">
          <b-autocomplete
            v-model="searchTwo"
            :data="filteredDataObjTwo"
            placeholder="Team Two"
            @select="option => {match.teamTwoId = option._id;getTeam(2, match.teamTwoId);searchTwo=option.name}"
          >
            <template slot-scope="props">
              <div>{{props.option.name}}</div>
            </template>
            <template slot="empty">No results found</template>
          </b-autocomplete>
        </b-field>
        <b-field label="Players" v-if="teamTwo !== undefined && mode !== 'edit'">
          {{teamTwo.name}}
          <b-select expanded v-model="teamTwo.activePlayers" multiple placeholder="Select Players">
            <option v-for="option in teamTwo.players" :value="option" :key="option._id">
              <span>
                {{ option.name }}
                <p v-if="!teamTwo.activePlayerIds.includes(option._id)">(sub)</p>
              </span>
            </option>
          </b-select>
        </b-field>
        <b-field label="Teams decided"  v-if="mode !== 'edit'">
          <b-checkbox v-model="match.teamsDecided"></b-checkbox>
        </b-field>
        <b-field label="Date Time in ISO">
          <b-input v-model="match.dateTime"></b-input>
        </b-field>
        <b-field label="Match Type">
          <b-select v-model="match.type" expanded placeholder="Select Type">
            <option v-for="type in types" :value="type" :key="type">{{ type }}</option>
          </b-select>
        </b-field>
        {{match.streams}}
        <b-field label="Streams">
          <b-input v-model="inputStream"></b-input>
        </b-field>
        <div v-for="stream in streams" :key="stream">{{stream}}</div>
        <span @click="match.streams.push(inputStream);inputStream = ''" style="cursor:pointer">Click to add Stream!</span>
        <b-field v-if="mode !== 'edit'" label="Event">
          <b-select v-model="match.event" expanded placeholder="Event">
            <option v-for="event in events" :value="event._id" :key="event._id">{{ event.name }}</option>
          </b-select>
        </b-field>
        <div v-if="mode !== 'edit'">
          Maps
          <div v-for="(map, index) in match.maps" :key="index">
            {{index+1}}
            <b-field label="Map name">
              <b-select v-model="map.mapId" expanded placeholder="Select Type">
                <option v-for="map in maps" :value="map._id" :key="map._id">{{ map.name }}</option>
              </b-select>
            </b-field>
          </div>
          <!-- <p style="cursor:pointer;color:blue" @click="addMap">Click to add another map</p> -->
        </div>
        <b-button @click="submit">Submit</b-button>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: "AddEditMatch",
  props: {
    teams: [],
    events: { type: Array },
    passedMatch: {},
    mode: undefined
  },
  data() {
    return {
      types: ["group", "Rof16", "Rof8", "Rof4", "final", "friendly"],
      maps: [],
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
        streams: [],
        activePlayerIds: []
      },
      teamOne: undefined,
      searchOne: "",
      searchTwo: "",
      teamTwo: undefined,
      inputStream: ""
    };
  },
  mounted() {
    if (this.passedMatch._id) {
      this.match = this.passedMatch;
    }
    this.$axios('https://macvars.herokuapp.com/' + "api/gamemaps", {
      method: "get"
    })
      .then(function(response) {
        return response.data;
      })
      .then(response => {
        this.maps = response.data;
      });
  },
  computed: {
    filteredDataObjOne() {
      return this.teams.filter(option => {
        if (this.searchOne == undefined) {
          this.searchOne = "";
        }
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(this.searchOne.toLowerCase()) >= 0
        );
      });
    },
    filteredDataObjTwo() {
      return this.teams.filter(option => {
        if (this.searchTwo == undefined) {
          this.searchTwo = "";
        }
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(this.searchTwo.toLowerCase()) >= 0
        );
      });
    }
  },
  methods: {
    addMap() {
      this.match.maps.push({
        map: "",
        teamOneScore: "0",
        teamTwoScore: "0",
        playerStatIds: []
      });
    },
    submit() {
      if (this.mode === "edit") {
        this.editMatch();
      } else {
        this.addMatch();
      }
    },
    addMatch() {
       this.match.activePlayerIds = [];
      this.teamOne.activePlayers.forEach(player => {
        this.match.activePlayerIds.push(player._id);
      });
      this.teamTwo.activePlayers.forEach(player => {
        this.match.activePlayerIds.push(player._id);
      });
      this.$axios('https://macvars.herokuapp.com/' + "api/maps", {
        method: "post",
        data: this.match.maps[0]
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.match.mapIds = [response._id];
          this.$axios('https://macvars.herokuapp.com/' + "api/matches", {
            method: "post",
            data: this.match
          })
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              let editEvent = [];
              for (let i = 0; i < this.events.length; i++) {
                if (this.events[i]._id === this.match.event) {
                  editEvent = this.events[i];
                  break;
                }
              }
              editEvent.matchIds.push(response._id);
              if(editEvent.matches){
                delete editEvent.matches
              }
              if(editEvent.teams){
                delete editEvent.teams
              }
              this.$axios(
                'https://macvars.herokuapp.com/' + "api/events/" + this.match.event,
                {
                  method: "patch",
                  data: editEvent
                }
              )
                .then(function(response) {
                  return response.data;
                })
                .then(response => {
                  alert("Match has been created. Either close dialog or create another match!")
                });
            });
        });
    },
    editMatch() {
      this.$axios('https://macvars.herokuapp.com/' + `api/matches/${this.match._id}`, {
        method: "patch",
        data: {streams: this.match.streams, type: this.match.type, dateTime: this.match.dateTime},
        headers: {
          "content-type": "application/json"
        }
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          window.location.reload();
        });
    },
    getTeam(teamNumber, id) {
      if (teamNumber === 1) {
        this.teamOne = undefined;
        this.$axios('https://macvars.herokuapp.com/' + `api/teams/${id}`, {
          method: "get"
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            this.teamOne = response;
            console.log("team1", this.teamOne);
          });
      } else {
        this.teamTwo = undefined;
        this.$axios('https://macvars.herokuapp.com/' + `api/teams/${id}`, {
          method: "get"
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            this.teamTwo = response;
          });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
