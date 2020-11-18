<template>
  <div class="modal-card" style="width:800px">
    <section class="info-tiles" style="margin-top:50px">
      <article class="tile is-child box">
        {{mode}}
        <b-field label="Name">
          <b-input v-model="team.name"></b-input>
        </b-field>
        <b-field label="Players" v-if="team.activePlayerIds">
          <b-select expanded v-model="team.activePlayerIds" multiple placeholder="Select Players">
            <option
              v-for="option in players"
              :value="option._id"
              :key="option._id"
            >{{ option.name }}</option>
          </b-select>
        </b-field>
        <b-field label="Substitutes" v-if="team.playerIds">
          <b-select expanded v-model="team.playerIds" multiple placeholder="Select Subs">
            <option
              v-for="option in players"
              :value="option._id"
              :key="option._id"
            >{{ option.name }}</option>
          </b-select>
        </b-field>
          LEAVE IMAGE BLANK IF YOU DONT HAVE IMAGE AND WANT TO USE DEFAULT HEADSHOT
        <b-field class="file">
          <b-upload v-model="team.files">
            <a class="button">
              <b-icon icon="upload"></b-icon>
              <span>Upload Image</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="team.files">{{ team.files.name }}</span>
        </b-field>
        <b-button @click="submit">Submit</b-button>
      </article>
    </section>
    <b-modal :active.sync="displayError">
      <p style="color:red">{{errorMessage}}</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "AddEditPlayers",
  props: {
    passedTeam: {},
    mode: undefined,
    players: { type: Array }
  },
  data() {
    return {
      team: {
        name: "",
        img: "",
        playerIds: [],
        eventStats: {},
        activePlayerIds: []
      },
      displayError: false,
      errorMessage: ''
    };
  },
  mounted() {
    if (this.passedTeam.name) {
      this.team = this.passedTeam;
    }
  },
  methods: {
    submit() {
      if (this.mode === "edit") {
        this.editTeam();
      } else {
        this.addTeam();
      }
    },
    editTeam() {
      if (this.team.activePlayerIds.length > 5) {
        this.displayError = true
        this.errorMessage = "Team cannot have more than 5 active players!"
        return
      } 
      this.team.activePlayerIds.forEach(playerId => {
        if (!this.team.playerIds.includes(playerId)){
          this.team.playerIds.push(playerId)
        }
      })
      if (this.team.files) {
        var formData = new FormData();
        formData.append("files", this.team.files);
        this.$axios('https://macvars.herokuapp.com/' + "api/uploads/teams", {
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
              this.team.img = response.name;
              this.$axios(
                'https://macvars.herokuapp.com/' + "api/teams/" + this.team._id,
                {
                  method: "patch",
                  data: this.team
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
        this.$axios(
          'https://macvars.herokuapp.com/' + "api/teams/" + this.team._id,
          {
            method: "patch",
            data: this.team
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
    addTeam() {
      if (this.team.activePlayerIds.length > 5) {
        this.displayError = true
        this.errorMessage = "Team cannot have more than 5 active players!"
        return
      }
      this.team.activePlayerIds.forEach(playerId => {
        if (!this.team.playerIds.includes(playerId)){
          this.team.playerIds.push(playerId)
        }
      })
      var formData = new FormData();
      formData.append("files", this.team.files);
      this.$axios('https://macvars.herokuapp.com/' + "api/uploads/teams", {
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
            this.team.img = response.name;
            if( this.team.img === 'null.jpg'){
               this.team.img = "1592755349366-val.png"
            }
            this.$axios('https://macvars.herokuapp.com/' + "api/teams", {
              method: "post",
              data: this.team
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
