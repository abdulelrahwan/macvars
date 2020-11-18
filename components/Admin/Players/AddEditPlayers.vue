<template>
  <div class="modal-card" style="width:800px">
    <section class="info-tiles" style="margin-top:50px">
      <article class="tile is-child box">
        {{mode}}
        <b-field label="Name">
          <b-input v-model="player.name"></b-input>
        </b-field>
        <b-field label="Real First Name">
          <b-input v-model="player.realName.first"></b-input>
        </b-field>
        <b-field label="Real Last Name">
          <b-input v-model="player.realName.last"></b-input>
        </b-field>
        <b-field label="Flag">
          <b-select v-model="player.flag" expanded placeholder="Select Flag">
            <option
              v-for="option in flagOptions"
              :value="option.value"
              :key="option.value"
            >{{ option.text }}</option>
          </b-select>
        </b-field>
        <b-field label="Twitter">
          <b-input v-model="player.socials.twitter"></b-input>
        </b-field>
        <b-field label="Twitch">
          <b-input v-model="player.socials.twitch"></b-input>
        </b-field>
        LEAVE IMAGE BLANK IF YOU DONT HAVE IMAGE AND WANT TO USE DEFAULT HEADSHOT
        <b-field class="file">
          <b-upload v-model="player.files">
            <a class="button">
              <b-icon icon="upload"></b-icon>
              <span>Upload Image</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="player.files">{{ player.files.name }}</span>
        </b-field>
        <b-button @click="submit">Submit</b-button>
      </article>
    </section>
  </div>
</template>

<script>
import flagOptions from "../../../assets/flags/flags.json";
export default {
  name: "AddEditPlayers",
  props: {
    passedPlayer: {},
    mode: undefined
  },
  data() {
    return {
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
        team: " "
      },
      flagOptions: flagOptions
    };
  },
  mounted() {
    if (this.passedPlayer.name) {
      this.player = this.passedPlayer;
    }
  },
  methods: {
    submit() {
      if (this.mode === "edit") {
        this.editPlayer();
      } else {
        this.addPlayer();
      }
    },
    editPlayer() {
      if (this.player.files) {
        var formData = new FormData();
        formData.append("files", this.player.files);
        this.$axios('https://macvars.herokuapp.com/' + "api/uploads/players", {
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
              this.player.img = response.name;
              this.$axios(
                'https://macvars.herokuapp.com/' + "api/players/" + this.player._id,
                {
                  method: "patch",
                  data: this.player
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
        this.$axios('https://macvars.herokuapp.com/' + "api/players/" + this.player._id, {
          method: "patch",
          data: this.player
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
    },
    addPlayer() {
      var formData = new FormData();
      formData.append("files", this.player.files);
      this.$axios('https://macvars.herokuapp.com/' + "api/uploads/players", {
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
            this.player.img = response.name;
            if(this.player.img === 'null.jpg'){
              this.player.img = "1593893229691-playerunknown.png"
            }
            this.$axios('https://macvars.herokuapp.com/' + "api/players", {
              method: "post",
              data: this.player
            })
              .then(function(response) {
                return response.data;
              })
              .then(response => {
                if (response.code !== undefined) {
                  this.$buefy.snackbar.open(response.message);
                } else {
                  let body = {
                    playerId: response._id,
                    isUpdated: true,
                    matchHistory: {
                      numMatchesPlayed: 0,
                      numMapsPlayed: 0,
                      winRate: 0,
                      avgCombatScore: 0,
                      kills: 0,
                      deaths: 0,
                      assists: 0,
                      fbpr:  0,
                      dpr:  0,
                      kpr:  0,
                      econRating:  0,
                      rating: 0,
                      numRoundsPlayed: 0,
                      
                    },
                    mapHistory: {
                      stats: {}
                    }
                  };
                  this.$axios('https://macvars.herokuapp.com/' + `api/playerstatstotal/`, {
                    method: "post",
                    data: body
                  })
                    .then(function(response) {
                      return response.data;
                    })
                    .then(res => {
                      window.location.reload();
                    });
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
