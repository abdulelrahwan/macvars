<template>
  <div class="modal-card" style="width:800px;">
    <section class="info-tiles" style="margin-top:50px">
      <article class="tile is-child box">
		  <div class="columns is-centered">
			  <div class="column is-half">
          <p v-if="teamOne !== undefined">{{teamOne.name + ' players'}}</p>
          <div v-for="player in teamOneActivePlayersInMatch" :key="player._id">
              <span>
                <p style="display: inline-block; margin-right:10px">{{player.name}}</p>
                <b-button v-if="!postSubmissionSwap" @click="openSwapPlayerModal(player, teamOne)">swap</b-button>
                <b-dropdown v-else aria-role="list">
                  <button class="button is-primary" slot="trigger" slot-scope="{ active }">
                    <span>Swap map</span>
                    <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                  </button>
                  <div v-for="map in match.mapIds" :key="map">
                    <b-dropdown-item @click="openSwapPlayerModal(player, teamOne, map)" aria-role="listitem">{{map}}</b-dropdown-item>
                  </div>
                  <b-dropdown-item @click="openSwapPlayerModal(player, teamOne, 'all')" aria-role="listitem">All maps</b-dropdown-item>
                </b-dropdown>
              </span>
          </div>
		    </div>
				<div class="column is-half">
		      <p v-if="teamTwo !== undefined">{{teamTwo.name + ' players'}}</p>
		      <div v-for="player in teamTwoActivePlayersInMatch" :key="player._id">
            <span>
              <p style="display: inline-block;  margin-right:10px">{{player.name}}</p>
              <b-button v-if="!postSubmissionSwap" @click="openSwapPlayerModal(player, teamTwo)">swap</b-button>
              <b-dropdown v-else aria-role="list">
                <button class="button is-primary" slot="trigger" slot-scope="{ active }">
                  <span>Swap map</span>
                  <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
                </button>
                <div v-for="map in match.mapIds" :key="map">
                  <b-dropdown-item @click="openSwapPlayerModal(player, teamTwo, map)" aria-role="listitem">{{map}}</b-dropdown-item>
                </div>
                <b-dropdown-item @click="openSwapPlayerModal(player, teamTwo, map)" aria-role="listitem">All maps</b-dropdown-item>
              </b-dropdown>
            </span>
          </div>
		    </div>
	    </div>
      <b-button @click="submit">Submit</b-button>
      </article>
    </section>
		<b-modal :active.sync="swapPlayer" has-modal-card trap-focus>
			<div class="modal-card" style="width:800px;">
			  <b-field v-if="selectedPlayer !== undefined" v-bind:label="'Select the player you want to replace ' + selectedPlayer.name + ' with and click Confirm'">
          <b-select v-if="selectedPlayerTeam.players !== undefined" expanded v-model="newPlayer" placeholder="Select Player">
            <option
              v-for="player in selectedPlayerTeam.players"
              :value="player"
              :key="player._id"
            >{{ player.name }}</option>
          </b-select>
        </b-field>
				<b-button @click="saveSubstitution(selectedPlayer, newPlayer, mapToSwap)">Confirm selection</b-button>
			</div>
    </b-modal>
  </div>
</template>

<script>
import async from "async";
export default {
  name: "SwapPlayers",
  props: {
    match: {},
    postSubmissionSwap: undefined
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
			newPlayer: undefined
    };
  },
  mounted() {
    this.getTeam(1, this.match.teamOneId)
    this.getTeam(2, this.match.teamTwoId)
  },
  methods: {
    getTeam(teamNumber, id) {
      if (teamNumber === 1) {
        this.$axios('https://macvars.herokuapp.com/' + `api/teams/${id}`, {
          method: "get"
        })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.teamOne = response
          this.teamOne.players.forEach(player => {
            if (this.match.activePlayerIds.includes(player._id)) {
              this.teamOneActivePlayersInMatch.push(player)
            }
          });
        });
      } else {
        this.$axios('https://macvars.herokuapp.com/' + `api/teams/${id}`, {
          method: "get"
        })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
					this.teamTwo = response
					this.teamTwo.players.forEach(player => {
						if (this.match.activePlayerIds.includes(player._id)) {
							this.teamTwoActivePlayersInMatch.push(player)
						}
					});
        });
      }
    },
    openSwapPlayerModal(player, playerTeam, map) {
			this.selectedPlayer = player
			this.selectedPlayerTeam = playerTeam
			this.swapPlayer = true
		},
		saveSubstitution(selectedPlayer, newPlayer, map) {
			this.substitutions.push({
				originalPlayer: selectedPlayer,
				newPlayer: newPlayer,
				map: map
			})
			this.swapPlayer = false
		},
		submit() {
      if (this.postSubmissionSwap){
        async.eachSeries(this.substitutions, (substitution, callback) => {
          if (substitution.map != 'all') {
            this.$axios('https://macvars.herokuapp.com/' + 
            `api/playerStats/?playerId=${substitution.originalPlayer._id}&mapId=${substitution.map}`, {
              method: 'get'
            })
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              if (response.data[0] !== undefined){
              this.$axios('https://macvars.herokuapp.com/' + 
              `api/playerStats/${response.data[0]._id}`, {
                method: 'patch',
                headers: {
                  "content-type": "application/json"
                },
                data: {playerId: substitution.newPlayer._id}
                })
              .then(function(response) {
                return response.data;
              })
              .then(response => {
                callback()
              })
              } else {
                callback()
              }
            });
          } else {
            async.each(this.match.mapIds, (map, cb) => {
              this.$axios('https://macvars.herokuapp.com/' + 
              `api/playerStats/?playerId=${substitution.originalPlayer._id}&mapId=${map}`, {
                method: 'get'
              })
              .then(function(response) {
                return response.data;
              })
              .then(response => {
                if (response.data[0] !== undefined) {
                  this.$axios('https://macvars.herokuapp.com/' + 
                  `api/playerStats/${response.data[0]._id}`, {
                    method: 'patch',
                    headers: {
                      "content-type": "application/json"
                    },
                    data: {playerId: substitution.newPlayer._id}
                    })
                  .then(function(response) {
                    return response.data;
                  })
                  .then(response => {
                    cb()
                  })
                } else {
                  cb()
                }
              });
            }, (err) => {
              if (err) {
                this.$buefy.snackbar.open('Error: ' + err)}
              else {
                callback()
              }
            })
          }
        }, (err) => {
          if(err) {
            this.$buefy.snackbar.open(err)
          } else {
            window.location.reload()
          }
        })
      } else {
        for (let i = 0; i < JSON.parse(JSON.stringify(this.substitutions)).length; i++) {
          let index = this.match.activePlayerIds.indexOf(JSON.parse(JSON.stringify(this.substitutions[i])).originalPlayer._id);
          if (index !== -1) {
            this.match.activePlayerIds[index] = this.substitutions[i].newPlayer._id;
          }
        }
        this.$axios('https://macvars.herokuapp.com/' + 
            `api/matches/${this.match._id}`, {
              method: 'patch',
              headers: {
                "content-type": "application/json"
              },
              data: {activePlayerIds: this.match.activePlayerIds}
            })
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              window.location.reload()
            })
      }
		}
  }
};
</script>

<style scoped lang="scss">
</style>
