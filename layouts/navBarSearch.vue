<template>
  <section>
    <b-field>
      <b-autocomplete
        max-height="400px"
        v-model="typingData"
        style="width:230px;border-bottom-color:#171e29;border-bottom-height:1px"
        rounded
        icon="magnify"
        :data="playerSearchData"
        placeholder="Search..."
        field="name"
        :loading="fetchingPlayer"
        v-bind:dropdown-position="$device.isMobile?'top':'bottom'"
        @typing="name=>searchFor=='player'?getPlayerSearchResults(name):getTeamSearchResults(name)"
        @select="option => {searchFor=='player'?navPlayer(option):navTeam(option)}"
        @click.native="onFocus"
      >
        <template slot="header" v-if="!$device.isMobile">
          <div style="text-align:center;font-size:20px;cursor:pointer">
            <span
              :style="{'color':searchFor=='player'?'#ff4653':'white'}"
              @click="searchFor='player';playerSearchData=[];getPlayerSearchResults(typingData)"
              style="margin-right:4px"
            >Players</span>
            <span style="margin-right:4px">|</span>
            <span
              style="margin-left:4px"
              :style="{'color':searchFor=='team'?'#ff4653':'white'}"
              @click="searchFor='team';playerSearchData=[];getTeamSearchResults(typingData)"
            >Teams</span>
          </div>
        </template>
        <template slot="footer" v-if="$device.isMobile">
          <div style="text-align:center;font-size:20px;cursor:pointer">
            <span
              :style="{'color':searchFor=='player'?'#ff4653':'white'}"
              @click="searchFor='player';playerSearchData=[];getPlayerSearchResults(typingData)"
              style="margin-right:4px"
            >Players</span>
            <span style="margin-right:4px">|</span>
            <span
              style="margin-left:4px"
              :style="{'color':searchFor=='team'?'#ff4653':'white'}"
              @click="searchFor='team';playerSearchData=[];getTeamSearchResults(typingData)"
            >Teams</span>
          </div>
        </template>
        <template slot-scope="props">
          <div v-if="searchFor=='player'">
            <div v-if="props.option._id === playerSearchData[0]._id">
              <div class="columns is-centered" v-if="!$device.isMobile">
                <div class="column is-half" v-if="!$device.isMobile">
                  <img
                    :src=" getPlayerImgUrl(props.option.img)"
                    style="width:80px;height:auto;max-width: 80px;max-height: 80px;"
                  />
                </div>
                <div class="column is-half">
                  <div
                    v-if="props.option.realName.first !== undefined && props.option.realName.first !== ''"
                  >
                    <p style="margin-top:-5px;font-size:20px;color:#ff726f">
                      <b>{{ props.option.name }}</b>
                    </p>
                    <span>
                      <country-flag
                        v-if="props.option.flag !== undefined"
                        v-bind:country="props.option.flag"
                        size="normal"
                        style="vertical-align:-13.5px; margin-left:-20px; margin-right:-15px"
                      />
                      <country-flag
                        v-if="props.option.flag === undefined"
                        country="ca"
                        size="normal"
                        style="vertical-align:-13.5px; margin-left:-20px; margin-right:-15px"
                      />
                      {{props.option.realName.first + " " + props.option.realName.last}}
                    </span>
                  </div>
                  <div
                    style="margin-left:-10px;margin-top:17px;"
                    v-if="props.option.realName.first === undefined || props.option.realName.first === ''"
                  >
                    <span style="margin-left:-20px;margin-top:50px;font-size:20px;color:#ff726f">
                      <country-flag
                        v-if="props.option.flag !== undefined"
                        v-bind:country="props.option.flag"
                        size="normal"
                        style="vertical-align:-13.5px; margin-left:-20px; margin-right:-15px"
                      />
                      <country-flag
                        v-if="props.option.flag === undefined"
                        country="un"
                        size="normal"
                        style="vertical-align:-13.5px; margin-left:-20px; margin-right:-15px"
                      />
                      {{ props.option.name }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="$device.isMobile">
                <!-- <p style="margin-top:-5px;font-size:20px;color:#ff726f"><b>{{ props.option.name }}</b></p> -->
                <span>
                  <country-flag
                    v-if="props.option.flag !== undefined"
                    v-bind:country="props.option.flag"
                    size="small"
                    style="vertical-align:-13.5px; margin-left:-20px; margin-right:-15px"
                  />
                  <country-flag
                    v-if="props.option.flag === undefined"
                    country="un"
                    size="small"
                    style="vertical-align:-13.5px; margin-left:-20px; margin-right:-15px"
                  />
                  <div v-if="props.option.realName.first !== ''" style="display:inline-block">
                    {{props.option.realName.first}}
                    <span
                      style="color:#ff726f;margin-left:4px;"
                    >"{{ props.option.name }}"</span>
                    <span style="margin-left:4px">{{props.option.realName.last}}</span>
                  </div>
                  <div v-if="props.option.realName.first == ''" style="display:inline-block">
                    {{props.option.realName.first}}
                    <span
                      style="color:#ff726f;margin-left:4px;"
                    >{{ props.option.name }}</span>
                    <span style="margin-left:4px">{{props.option.realName.last}}</span>
                  </div>
                </span>
              </div>
            </div>
            <div v-if="props.option._id !== playerSearchData[0]._id">
              <span>
                <country-flag
                  v-if="props.option.flag !== undefined"
                  v-bind:country="props.option.flag"
                  size="small"
                  style="vertical-align:-15px; margin-left:-20px; margin-right:-15px"
                />
                <country-flag
                  v-if="props.option.flag === undefined"
                  country="un"
                  size="small"
                  style="vertical-align:-15px; margin-left:-20px; margin-right:-15px"
                />
                <div v-if="props.option.realName.first !== ''" style="display:inline-block">
                  {{props.option.realName.first}}
                  <span
                    style="color:#ff726f;margin-left:4px;"
                  >"{{ props.option.name }}"</span>
                  <span style="margin-left:4px">{{props.option.realName.last}}</span>
                </div>
                <div v-if="props.option.realName.first == ''" style="display:inline-block">
                  {{props.option.realName.first}}
                  <span
                    style="color:#ff726f;margin-left:4px;"
                  >{{ props.option.name }}</span>
                  <span style="margin-left:4px">{{props.option.realName.last}}</span>
                </div>
              </span>
            </div>
          </div>
          <div v-if="searchFor=='team'" style="width:100%;height:50px;">
            <nuxt-link :to="`/teams/${props.option._id}`" style="width:100%;height:40px">
              <img style="vertical-align:middle;width:40px" :src=" getTeamImgUrl(props.option.img)" />
              <span style="margin-left:80px;color:white">{{ props.option.name }}</span>
            </nuxt-link>
          </div>
        </template>
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
  </section>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  name: "navBarSearch",
  props: [],
  data() {
    return {
      searchFor: "player",
      notifications: undefined,
      playerSearchData: [],
      playerSelected: null,
      fetchingPlayer: false,
      playerName: "",
      selected: null,
      loading: true,
      typingData: ""
    };
  },
  methods: {
    getPlayerSearchResults: debounce(function(name) {
      if (!name.length) {
        this.playerSearchData = [];
        // this.playerPage = 1
        // this.totalPlayerPages = 1
        return;
      }
      this.fetchingPlayer = true;
      this.$axios('https://macvars.herokuapp.com/' + `api/players?name[$search]=${name}`, {
        method: "get",
        headers: {
          "content-type": "application/json"
        }
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.playerSearchData = [];
          response.data.forEach(item => this.playerSearchData.push(item));
        })
        .catch(error => {
          this.playerSearchData = [];
          throw error;
        })
        .finally(() => {
          this.fetchingPlayer = false;
        });
    }, 500),
    getTeamSearchResults: debounce(function(name) {
      if (!name.length) {
        this.playerSearchData = [];
        // this.playerPage = 1
        // this.totalPlayerPages = 1
        return;
      }
      this.fetchingPlayer = true;
      this.$axios('https://macvars.herokuapp.com/' + `api/teams?name[$search]=${name}`, {
        method: "get",
        headers: {
          "content-type": "application/json"
        }
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.playerSearchData = [];
          response.data.forEach(item => this.playerSearchData.push(item));
        })
        .catch(error => {
          this.playerSearchData = [];
          throw error;
        })
        .finally(() => {
          this.fetchingPlayer = false;
        });
    }, 500),
    getPlayerImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/players/${img}`;
    },
    getTeamImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${img}`;
    },
    navPlayer(player) {
      if (player) {
        this.$router.push({ path: `/players/${player._id}` });
      }
    },
    navTeam(team) {
      if(team){
        this.$router.push({ path: `/teams/${team._id}` });
      }
    },
    onFocus(e) {
      e.stopPropagation();
    }
  }
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Titillium+Web");

@import "~bulma/sass/utilities/_all";

@media screen and (min-width: 640px) {
  .home-nav {
    margin-left: 40px;
  }
}
@media screen and (max-width: 640px) {
  .navbar-item {
    &.has-dropdown {
      .nv-dropdown {
        display: none;
      }
      &.is-active {
        .nv-dropdown {
          display: block;
        }
      }
    }
  }
}
.dropdown-content {
  width: 300px;
}
.icon is-right {
  margin-right: 10px;
}
</style>

