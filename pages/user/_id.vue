<template>
  <div class="hello">
    <div class="columns is-centered">
      <div class="column is-full">
        <div class="card" style="margin-top:20px;">
          <div class="card-content" v-if="user">
            <p class="title">{{user.username}}</p>
            <div
              v-if="auth && auth.user.permissions.includes('moderator') && (user.isBanned === undefined || user.isBanned === false)"
            >
              <b-button v-on:click="banUser(user)">Ban user</b-button>
            </div>
            <div
              v-if="auth && auth.user.permissions.includes('moderator') && (user.isBanned !== undefined && user.isBanned === true)"
            >
              <b-button v-on:click="unBanUser(user)">Unban user</b-button>
            </div>
            <p class="subtitle" style="margin-top:10px">Joined: {{formatDate(user.createdAt)}}</p>
            <b-field
              label="Flag"
              v-if="auth!=undefined && auth.user._id === this.$route.params.id "
            >
              <b-select v-model="user.flag" expanded placeholder="Select Flag">
                <option
                  v-for="option in flagOptions"
                  :value="option.value"
                  :key="option.value"
                >{{ option.text }}</option>
              </b-select>
            </b-field>
            <b-field
              label="Favorite Player"
              style="text-align:center"
              v-if="auth!=undefined && auth.user._id === this.$route.params.id "
            >
              <b-autocomplete
                icon="magnify"
                :data="playerSearchData"
                :placeholder="user.favPlayer && user.favPlayer.name?user.favPlayer.name:'Search player...'"
                field="name"
                :loading="fetchingPlayer"
                @typing="getPlayerSearchResults"
                @select="option => {selected = option;}"
                @click.native="onFocus"
              >
                <template slot-scope="props">
                  <div>
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
                </template>
                <template slot="empty">No results found</template>
              </b-autocomplete>
            </b-field>
            <div
              style="cursor:pointer;"
              v-if="auth!=undefined && auth.user._id === this.$route.params.id "
              @click="user.favPlayer?user.favPlayer.name =undefined:user.favPlayer.name=undefined;selected=undefined"
            >Clear Favorite Player</div>
            <b-button
              style="background-color:#ff726f"
              @click="setFlag(user.flag)"
              v-if="auth!=undefined && auth.user._id === this.$route.params.id "
            >Update</b-button>
            <div
              style="text-align:left"
              v-if="(auth==undefined || auth.user._id !== this.$route.params.id )&& user.favPlayer"
            >
              <b>Favorite Player:</b>
              {{user.favPlayer.name}}
            </div>
          </div>
        </div>
        <div
          class="card"
          style="margin-top:20px;"
          v-if="auth!=undefined && auth.user._id === this.$route.params.id "
        >
          <div class="card-content" v-if="user">
            Notifications
            <div
              style="text-align:right;color:#ff726f;cursor:pointer"
              @click="clearNotifs"
            >Clear All</div>
            <b-table
              :mobile-cards="false"
              :data="notificationsArray"
              :striped="true"
              :hoverable="true"
              style="cursor:pointer"
              @click="(row)=>navNotif(row)"
            >
              <template slot-scope="props">
                <b-table-column field="id">
                  <div>
                    {{props.row[Object.keys(props.row)[0]].text}}
                    <span
                      style="float:right;"
                    >{{formatDate(props.row[Object.keys(props.row)[0]].dateTime)}}</span>
                  </div>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
        <div class="card" style="margin-top:20px;">
          <div class="card-content" v-if="user">
            Recent Comments
            <b-table :mobile-cards="false" :data="commentsArray" :striped="true" :hoverable="true">
              <template slot-scope="props">
                <b-table-column field="id">
                  <div class="comment-mobile">
                    <b>{{props.row.user.username}}</b>
                    <span style="float:right;">{{formatDate(props.row.dateTime)}}</span>
                  </div>
                  <div class="word-mobile" style="word-wrap: break-word;">
                    <vue-markdown v-if="props.row.isRemoved !== true">{{props.row.text}}</vue-markdown>
                    <vue-markdown v-else><p style="color:red">
                  <i>This comment has been deleted</i>
                </p></vue-markdown>
                  </div>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flagOptions from "../../assets/flags/flags.json";
import debounce from "lodash/debounce";

const moment = require("moment");
export default {
  name: "User",
  props: {
    type: String
  },
  data() {
    return {
      user: undefined,
      commentsArray: [],
      notificationsArray: [],
      flagOptions: flagOptions,
      auth: undefined,
      playerSearchData: [],
      playerSelected: null,
      fetchingPlayer: false,
      playerName: "",
      selected: null,
      loading: true
    };
  },
  mounted() {
    this.$watch(
      () => {
        return this.$route.params.id;
      },
      (newVal, oldVal) => {
        location.reload();
      },
      {
        deep: true
      }
    );
    this.$aes.setKey("SECURE_VAL_PW");
    var authEnc = localStorage.getItem("auth");
    if (authEnc) {
      let auth = JSON.parse(this.$aes.decrypt(authEnc));
      this.auth = auth;
    }
    this.$axios(
      'https://macvars.herokuapp.com/' +
        `api/comments?userId=${this.$route.params.id}&$sort[updatedAt]=-1&$limit=7`,
      {
        method: "get",
        headers: new Headers({ "content-type": "application/json" })
      }
    )
      .then(function(response) {
        return response.data;
      })
      .then(res => {
        this.commentsArray = res.data;
      });
    this.$axios('https://macvars.herokuapp.com/' + `users/${this.$route.params.id}`, {
      method: "get",
      headers: new Headers({ "content-type": "application/json" })
    })
      .then(function(response) {
        return response.data;
      })
      .then(res => {
        this.user = res;
        this.notificationsArray = Object.entries(
          this.user.notifications
        ).map(e => ({ [e[0]]: e[1] }));
      });
  },
  methods: {
    navTwitter() {
      window.open("https://twitter.com/jhhjhj", "_blank");
    },
    formatDate(dateTime) {
      return moment(dateTime).format("MMMM DD, YYYY");
    },
    navNotif(notif) {
      const id = Object.keys(notif)[0];
      const type = notif[Object.keys(notif)[0]].type;
      const slug = notif[Object.keys(notif)[0]].slug;
      delete this.user.notifications[id];
      this.$axios('https://macvars.herokuapp.com/' + `users/${this.$route.params.id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: this.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          // window.location.reload();
        });
      this.$router.push({ path: `/${type}/${id}/${slug}` });
    },
    clearNotifs() {
      this.user.notifications = {};
      this.$axios('https://macvars.herokuapp.com/' + `users/${this.$route.params.id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: this.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          window.location.reload();
        });
    },
    setFlag(code) {
      if (code === undefined) {
        this.$buefy.snackbar.open({
          message: "Please select a flag.",
          duration: 1000
        });
      } else {
        if (this.selected) {
          let favPlayer = {
            name: this.selected.name,
            img: this.selected.img
          };
          this.user.favPlayer = favPlayer;
        }
        this.$axios('https://macvars.herokuapp.com/' + `users/${this.$route.params.id}`, {
          method: "patch",
          headers: new Headers({ "content-type": "application/json" }),
          data: this.user
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            if (response.code !== undefined) {
              this.$buefy.snackbar.open(response.message);
            } else {
              this.$buefy.snackbar.open({
                message: "Info is updated!",
                duration: 15000
              });
            }
          });
      }
    },
    banUser(user) {
      this.$axios('https://macvars.herokuapp.com/' + `users/${this.$route.params.id}`, {
        method: "patch",
        headers: new Headers({ "content-type": "application/json" }),
        data: { isBanned: true }
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
    },
    unBanUser(user) {
      this.$axios('https://macvars.herokuapp.com/' + `users/${this.$route.params.id}`, {
        method: "patch",
        headers: new Headers({ "content-type": "application/json" }),
        data: { isBanned: false }
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
    },
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
    getPlayerImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/players/${img}`;
    },
    navPlayer(player) {
      this.selected = player;
      if (player) {
        this.$router.push({ path: `/players/${player._id}/${player.slug}` });
      }
    },
    onFocus(e) {
      e.stopPropagation();
    }
  },
  components: {}
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
