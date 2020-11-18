<template>
  <div class="modal-card" style="width:800px;">
    <section class="info-tiles" style="margin-top:50px">
      <article class="tile is-child box">
        {{mode}}
        <b-field label="Name">
          <b-input v-model="event.name"></b-input>
        </b-field>
        <p class="label">Groups</p>
        <div
          @click="event.groups.push([])"
          style="cursor:pointer;color:blue;"
        >Click to add empty group</div>
        <div v-for="(group, index) in event.groups" :key="index">
          {{index+1}}
          <div v-for="team in group" :key="team">
            <div v-if="teamsObj[team]">
              {{teamsObj[team].name}} -
              <span
                style="color:red;cursor:pointer"
                @click="removeTeamGroup(group,team)"
              >Delete</span>
            </div>
          </div>
          <br />
        </div>
        <b-field label="Group number">
          <b-input v-model="addTeamGroup.groupNum"></b-input>
        </b-field>
        <b-field label="Team to add to Group">
          <b-select v-model="addTeamGroup.team" expanded placeholder="Select Team">
            <option v-for="team in teams" :value="team" :key="team._id">{{ team.name }}</option>
          </b-select>
        </b-field>
        <div @click="addTeamToGroup" style="cursor:pointer;color:blue;">Click to add team to group</div>
        <b-field label="# of teams advancing per group" style="margin-top:20px">
          <b-input v-model="event.NofTeamsAdvanceInGroup"></b-input>
        </b-field>
        <b-field label="Event Details">
          <b-input
            v-model="event.details"
            type="textarea"
            style="resize:none;white-space: pre-wrap;word-wrap: break-word;"
          ></b-input>
        </b-field>
        <b-field label="Date From - iso format" v-if="event.date">
          <b-input v-model="event.date.from"></b-input>
        </b-field>
        <b-field label="Date to - iso format" v-if="event.date">
          <b-input v-model="event.date.to"></b-input>
        </b-field>
        <b-field label="Number of teams">
          <b-input v-model="event.numberOfTeams"></b-input>
        </b-field>
        <b-field label="Location eg. Europe(Online)">
          <b-input v-model="event.location"></b-input>
        </b-field>
        <b-field label="Flag">
          <b-select v-model="event.flag" expanded placeholder="Select Flag">
            <option
              v-for="option in flagOptions"
              :value="option.value"
              :key="option.value"
            >{{ option.text }}</option>
          </b-select>
        </b-field>
        <b-field class="file">
          <b-upload v-model="event.files">
            <a class="button">
              <b-icon icon="upload"></b-icon>
              <span>Upload Event Image</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="event.files">{{ event.files.name }}</span>
        </b-field>
        <b-button @click="submit">Submit</b-button>
      </article>
    </section>
  </div>
</template>

<script>
import flagOptions from "../../../assets/flags/flags.json"
export default {
  name: "AddEditEvent",
  props: {
    passedEvent: {},
    mode: undefined,
    teamsObj: {},
    teams: []
  },
  data() {
    return {
      event: {},
      addTeamGroup: {
        team: undefined,
        groupNum: 1
      },
      teamsToEdit: [],
      flagOptions: flagOptions
    };
  },
  mounted() {
    this.event = this.passedEvent;
    if(this.event.teamsObj === undefined){
      this.event.teamsObj = {}
    }
  },
  methods: {
    addTeamToGroup() {
      this.event.groups[parseInt(this.addTeamGroup.groupNum - 1)].push(
        this.addTeamGroup.team._id
      );
      this.event.teamIds.push(this.addTeamGroup.team._id);
      for (let i = 0; i < this.addTeamGroup.team.activePlayerIds.length; i++) {
        this.event.activePlayerIds.push(this.addTeamGroup.team.playerIds[i]);
        if(this.event.teamsObj[this.addTeamGroup.team._id]!=undefined){
          this.event.teamsObj[this.addTeamGroup.team._id].push(this.addTeamGroup.team.playerIds[i])
        } else{
          this.event.teamsObj[this.addTeamGroup.team._id] = [this.addTeamGroup.team.playerIds[i]]
        }
        
      }
      for (let i = 0; i < this.teams.length; i++) {
        if (this.teams[i]._id === this.addTeamGroup.team._id) {
          let intialGroupStageStats = {
            points: 0,
            groupStageWins: 0,
            groupStageLoses: 0,
            groupStageRoundsWon: 0,
            groupStageRoundsLost: 0
          }
          if (!this.teams[i].eventStats) {
            this.teams[i].eventStats = {
              [this.event._id]: intialGroupStageStats
            };
          } else {
            this.teams[i].eventStats[this.event._id] = intialGroupStageStats
          }
          this.teamsToEdit.push(this.teams[i]);
          break;
        }
      }
    },
    removeTeamGroup(group, team) {
      for (let i = 0; i < group.length; i++) {
        if (group[i] === team) {
          group.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.event.teamIds.length; i++) {
        if (this.event.teamIds[i] === team) {
          this.event.teamIds.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.teamsToEdit.length; i++) {
        if (this.teamsToEdit[i]._id === team) {
          delete this.teamsToEdit[i].eventStats[this.event._id];
        }
      }
    },
    submit() {
      if (this.mode === "edit") {
        this.editEvent();
      } else {
        this.addEvent();
      }
    },
    editEvent() {
      this.editTeamsWithEvent();
      if (this.event.files) {
        var formData = new FormData();
        formData.append("files", this.event.files);
        this.$axios('https://macvars.herokuapp.com/' + "api/uploads/events", {
          method: "post",
          data: formData
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            if (response.code !== undefined) {
              this.$buefy.snackbar.open(response.message);
            } else {
              this.event.img = response.name;
              delete this.event.matches
              delete this.event.teams
              this.$axios(
                'https://macvars.herokuapp.com/' + "api/events/" + this.event._id,
                {
                  method: "patch",
                  data: this.event
                }
              )
                .then(function(response) {
                  return response.data;
                })
                .then(response => {
                  if (response.code !== undefined) {
                    this.$buefy.snackbar.open(response.message);
                  } else {
                    window.location.reload();
                  }
                });
            }
          });
      } else {
        delete this.event.matches
        delete this.event.teams
        this.$axios(
          'https://macvars.herokuapp.com/' + "api/events/" + this.event._id,
          {
            method: "patch",
            data: this.event
          }
        )
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            if (response.code !== undefined) {
              this.$buefy.snackbar.open(response.message);
            } else {
              window.location.reload();
            }
          });
      }
    },
    addEvent() {
      this.editTeamsWithEvent();
      var formData = new FormData();
      formData.append("files", this.event.files);
      this.$axios('https://macvars.herokuapp.com/' + "api/uploads/events", {
        method: "post",
        data: formData
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          if (response.code !== undefined) {
            this.$buefy.snackbar.open(response.message);
          } else {
            this.event.img = response.name;
            delete this.event.matches
            delete this.event.teams
            this.$axios('https://macvars.herokuapp.com/' + "api/events", {
              method: "post",
              data: this.event
            })
              .then(function(response) {
                return response.data;
              })
              .then(response => {
                if (response.code !== undefined) {
                  this.$buefy.snackbar.open(response.message);
                } else {
                  const dat = {
                    eventId: response._id,
                    isUpdated: false,
                    topPlayers: [],
                    topAgents: []
                  };
                  this.$axios('https://macvars.herokuapp.com/' + "api/eventstats", {
                    method: "post",
                    data: dat
                  })
                    .then(function(response) {
                      return response.data;
                    })
                    .then(response => {
                      if (response.code !== undefined) {
                        this.$buefy.snackbar.open(response.message);
                      } else {
                        window.location.reload();
                      }
                    });
                }
              });
          }
        });
    },
    editTeamsWithEvent() {
      for (let i = 0; i < this.teamsToEdit.length; i++) {
        this.$axios(
          'https://macvars.herokuapp.com/' + "api/teams/" + this.teamsToEdit[i]._id,
          {
            method: "patch",
            data: this.teamsToEdit[i]
          }
        )
          .then(function(response) {
            return response.data;
          })
          .then(response => {});
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
