<template>
  <div class="modal-card" style="width:800px;height:800px">
    <section class="info-tiles" style="margin-top:50px">
      <article class="tile is-child box" style="height:800px">
        <div v-if="playerToSwap">
          You are swaping
          <b style="font-size:35px">{{playerToSwap.name}}</b>
        </div>
        <b-field label="Find a player" v-if="players" style="margin-top:30px">
          <b-autocomplete
            v-model="playerName"
            placeholder="enter player"
            :open-on-focus="true"
            :data="filteredDataObj"
            field="name"
            @select="option => selectedNewPlayer = option"
          ></b-autocomplete>
        </b-field>
        <div
          v-if="selectedNewPlayer"
        >You will be swapping {{playerToSwap.name}} for {{selectedNewPlayer.name}}</div>
        <b-button style="margin-top:20px" @click="confirmSwap()">Swap</b-button>
      </article>
    </section>
  </div>
</template>

<script>
import async from "async";
export default {
  name: "SwapPlayers",
  props: {
    match: {},
    postSubmissionSwap: undefined,
    playerToSwap: {},
    playerTeamToSwap: {},
    players: undefined
  },
  data() {
    return {
      teamOne: undefined,
      teamTwo: undefined,
      teamOneActivePlayersInMatch: [],
      teamTwoActivePlayersInMatch: [],
      substitutions: [],
      swapPlayer: false,
      selectedPlayer: undefined,
      selectedPlayerTeam: undefined,
      mapToSwap: undefined,
      newPlayer: undefined,
      playerName: "",
      selectedNewPlayer: undefined
    };
  },
  computed: {
    filteredDataObj() {
      return this.players.filter(option => {
        if (this.playerName == undefined) {
          this.playerName = "";
        }
        if (option) {
          return (
            option.name.toLowerCase().indexOf(this.playerName.toLowerCase()) >=
            0
          );
        }
      });
    }
  },
  mounted() {
    if (this.playerTeamToSwap) {
      this.getTeam(this.playerTeamToSwap._id);
    }
  },
  methods: {
    confirmSwap() {
      if (
        this.playerTeamToSwap.playerIds.indexOf(this.selectedNewPlayer._id) === -1
      ) {
        // Add player to team first
        this.playerTeamToSwap.playerIds.push(this.selectedNewPlayer._id);
        this.$axios(
          'https://macvars.herokuapp.com/' + `api/teams/${this.playerTeamToSwap._id}`,
          {
            method: "patch",
            headers: {
              "content-type": "application/json"
            },
            data: this.playerTeamToSwap
          }
        )
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            this.addPlayerToMatch();
          });
      } else {
        this.addPlayerToMatch();
      }
    },
    addPlayerToMatch() {
      const index = this.match.activePlayerIds.indexOf(this.playerToSwap._id);
      if (index > -1) {
        this.match.activePlayerIds.splice(index, 1);
      }
      this.match.activePlayerIds.push(this.selectedNewPlayer._id)
      this.$axios('https://macvars.herokuapp.com/' + `api/matches/${this.match._id}`, {
        method: "patch",
        headers: {
          "content-type": "application/json"
        },
        data: { activePlayerIds: this.match.activePlayerIds }
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          window.location.reload();
        });
    },
    getTeam(id) {
      this.$axios('https://macvars.herokuapp.com/' + `api/teams/${id}`, {
        method: "get"
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          console.log(response);
        });
    },
    openSwapPlayerModal(player, playerTeam, map) {
      this.selectedPlayer = player;
      this.selectedPlayerTeam = playerTeam;
      this.swapPlayer = true;
    },
    saveSubstitution(selectedPlayer, newPlayer, map) {
      this.substitutions.push({
        originalPlayer: selectedPlayer,
        newPlayer: newPlayer,
        map: map
      });
      this.swapPlayer = false;
    },
    submit() {
      if (this.postSubmissionSwap) {
        async.eachSeries(
          this.substitutions,
          (substitution, callback) => {
            if (substitution.map != "all") {
              this.$axios(
                'https://macvars.herokuapp.com/' +
                  `api/playerStats/?playerId=${substitution.originalPlayer._id}&mapId=${substitution.map}`,
                {
                  method: "get"
                }
              )
                .then(function(response) {
                  return response.data;
                })
                .then(response => {
                  if (response.data[0] !== undefined) {
                    this.$axios(
                      'https://macvars.herokuapp.com/' +
                        `api/playerStats/${response.data[0]._id}`,
                      {
                        method: "patch",
                        headers: {
                          "content-type": "application/json"
                        },
                        data: { playerId: substitution.newPlayer._id }
                      }
                    )
                      .then(function(response) {
                        return response.data;
                      })
                      .then(response => {
                        callback();
                      });
                  } else {
                    callback();
                  }
                });
            } else {
              async.each(
                this.match.mapIds,
                (map, cb) => {
                  this.$axios(
                    'https://macvars.herokuapp.com/' +
                      `api/playerStats/?playerId=${substitution.originalPlayer._id}&mapId=${map}`,
                    {
                      method: "get"
                    }
                  )
                    .then(function(response) {
                      return response.data;
                    })
                    .then(response => {
                      if (response.data[0] !== undefined) {
                        this.$axios(
                          'https://macvars.herokuapp.com/' +
                            `api/playerStats/${response.data[0]._id}`,
                          {
                            method: "patch",
                            headers: {
                              "content-type": "application/json"
                            },
                            data: { playerId: substitution.newPlayer._id }
                          }
                        )
                          .then(function(response) {
                            return response.data;
                          })
                          .then(response => {
                            cb();
                          });
                      } else {
                        cb();
                      }
                    });
                },
                err => {
                  if (err) {
                    this.$buefy.snackbar.open("Error: " + err);
                  } else {
                    callback();
                  }
                }
              );
            }
          },
          err => {
            if (err) {
              this.$buefy.snackbar.open(err);
            } else {
              window.location.reload();
            }
          }
        );
      } else {
        for (
          let i = 0;
          i < JSON.parse(JSON.stringify(this.substitutions)).length;
          i++
        ) {
          let index = this.match.activePlayerIds.indexOf(
            JSON.parse(JSON.stringify(this.substitutions[i])).originalPlayer._id
          );
          if (index !== -1) {
            this.match.activePlayerIds[index] = this.substitutions[
              i
            ].newPlayer._id;
          }
        }
        this.$axios('https://macvars.herokuapp.com/' + `api/matches/${this.match._id}`, {
          method: "patch",
          headers: {
            "content-type": "application/json"
          },
          data: { activePlayerIds: this.match.activePlayerIds }
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            window.location.reload();
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
