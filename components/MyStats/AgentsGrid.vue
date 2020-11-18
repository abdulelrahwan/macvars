<template>
  <div class="columns is-multiline is-centered">
    <div class="column is-4" v-for="agent in agents" :key="agent.name">
      <figure class="image is-96x96" style="margin: auto">
        <img :src="getImgUrl(agent.name.toLowerCase())" alt="Placeholder image" />
      </figure>
      <div class="card">
        <div class="card-content">
          <p class="title is-4">{{ agent.name }}</p>
          <p class="title is-5" style="margin: 0">KDA</p>
          <p class="title is-5">{{ agent.KDA }}</p>
          <div class="columns is-mobile">
            <div class="column">
              <p>Played</p>
              <p>{{ agent.gamesPlayed }}</p>
            </div>
            <div class="column">
              <p>Won</p>
              <p>{{ agent.won }}</p>
            </div>
            <div class="column">
              <p>Lost</p>
              <p>{{ agent.lost }}</p>
            </div>
          </div>
          <div class="columns is-mobile">
            <div class="column">
              <p>Kills</p>
              <p>{{ agent.kills }}</p>
            </div>
            <div class="column">
              <p>Deaths</p>
              <p>{{ agent.deaths }}</p>
            </div>
            <div class="column">
              <p>Assists</p>
              <p>{{ agent.assists }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getImgUrl(character) {
      if (character === "sova") {
        return require("@/assets/characters/" + character + ".webp");
      }
      return require("@/assets/characters/" + character + ".png");
    }
  },
  data() {
    return {
      agents: [
        {
          name: 'Breach',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Brimstone',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Cypher',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Jett',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Viper',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Omen',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Phoenix',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Raze',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Sage',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
        {
          name: 'Sova',
          gamesPlayed: 23,
          won: 19,
          lost: 5,
          kills: 20,
          deaths: 5,
          assists: 0,
          KDA: 4,
        },
      ]
    }
  }
};
</script>

<style>
</style>