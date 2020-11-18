<template>
  <div class="hello">
    <div class="columns is-centered">
      <div class="column is-two-thirds">
        <div class="card" style="padding:50px;text-align:left">
          <div class="card-content">
            <p class="title">Teams</p>
            <b-button @click="addTeam">Add Team</b-button>
            <b-table
              style="height:800px;cursor:pointer"
              :paginated="true"
              :per-page="5"
              mobile-cards
              :data="teams"
              :striped="true"
              :hoverable="true"
              @click="(row)=>{if(!deletingDialogOpen) { editTeam(row) }}"
            >
              <template slot-scope="props">
                <b-table-column searchable label="Name" field="name">
                  <div style="text-align:left">{{props.row.name}}</div>
                </b-table-column>
                <b-table-column label="Players" field="name">
                  <p v-for="player in props.row.players" :key="player._id">{{player.name}}</p>
                </b-table-column>
                <b-table-column>
                  <b-button @click="deleteTeam(props.row)">DELETE</b-button>
                </b-table-column>
                <!-- <b-table-column label="Events" field="name">
                  <div
                    v-for="(stat, key) in props.row.eventStats"
                    :key="key"
                  ><p v-if="events">{{events[key]}}: {{stat.points}} points</p></div>
                </b-table-column> -->
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
    <b-modal :active.sync="addEditTeams" has-modal-card trap-focus>
      <AddEditTeams :players="players" :passedTeam="team" :mode="mode"></AddEditTeams>
    </b-modal>
  </div>
</template>

<script>

import AddEditTeams from "./AddEditTeams";
export default {
  name: "Admin",
  props: {
    teams: { type: Array },
    events: { type: Object },
    players: { type: Array }
  },
  data() {
    return {
      addEditTeams: false,
      mode: "",
      team: {
        name: "",
        img: "",
        playerIds: [],
        eventStats: {}
      }
    };
  },
  mounted() {
  },
  methods: {
    editTeam(team) {
      this.team = team;
      this.mode = "edit";
      this.addEditTeams = true;
    },
    addTeam(team) {
      this.team = team;
      this.mode = "add";
      this.addEditTeams = true;
    },
    deleteTeam(team) {
      this.deletingDialogOpen = true
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to delete team ${team.name}`,
        type: "is-dark",
        onConfirm: () => {
          this.$axios(
          'https://macvars.herokuapp.com/' + `api/teams/${team._id}`,
          {
            method: "delete"
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
        },
        onCancel: () => {
          this.deletingDialogOpen = false
        }
      });
    }
  },
  components: { AddEditTeams }
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
