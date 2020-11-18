<template>
  <div class="hello">
    <b-menu v-if="isForumsReady && isMatchesReady && isNewsReady">
      <b-menu-list style="text-align:left" v-for="activity in data.slice(0,5)" :key="activity._id">
        <div>
          <nuxt-link
            style="padding:0px"
            :to="`/${activity.type}/${activity._id}/${activity.slug}`"
          >
            <b-menu-item style="text-align:left;overflow:hidden;text-overflow: ellipsis;border-bottom-color:#171e29;border-bottom-height:1px;border-bottom-style:solid">
              <template slot="label">
                <div class="columns is-mobile">
                  <div class="column is-9" style="font-size:14px">
                    <div
                      v-if="activity.type === 'forums'"
                      style="width:3px;height:20px;background-color:#ff726f;display:inline-block;margin-left:-10px;margin-bottom:-5px"
                    ></div>
                    <div
                      v-if="activity.type === 'matches'"
                      style="width:3px;height:20px;background-color:green;display:inline-block;margin-left:-10px;margin-bottom:-5px"
                    ></div>
                    <div
                      v-if="activity.type === 'news'"
                      style="width:3px;height:20px;background-color:blue;display:inline-block;margin-left:-10px;margin-bottom:-5px"
                    ></div>
                    <div
                      style="height:30px;vertical-align:middle;margin-top:7px;margin-left:10px"
                      class="forum-title"
                      v-if="activity.type !='matches'"
                    >{{activity.title}}</div>
                    <div
                      style="height:30px;vertical-align:middle;margin-top:7px;margin-left:10px"
                      class="forum-title"
                      v-if="activity.type =='matches'"
                    >{{activity.teamOne.name}} vs {{activity.teamTwo.name}}</div>
                  </div>
                  <div class="column" style="text-align:end;font-size:14px;">
                    <span style="color:#ff726f">
                      <b-tooltip type="is-dark" label="Root level comments" position="is-left">
                        <div style="vertical-align:middle;margin-top:5px">
                          <span
                            v-if="activity.numComments === undefined"
                          >{{activity.commentIds.length}}</span>
                          <span v-if="activity.numComments != undefined">{{activity.numComments}}</span>
                        </div>
                      </b-tooltip>
                    </span>
                  </div>
                </div>
              </template>
            </b-menu-item>
          </nuxt-link>
        </div>
      </b-menu-list>
    </b-menu>
    <b-menu>
      <b-menu-list>
        <nuxt-link style="padding:0px" :to="'/forums'">
          <b-menu-item style="text-align:center;overflow:hidden;text-overflow: ellipsis;">
            <template slot="label">
              <div style="color:#ff726f;cursor:pointer">View All</div>
            </template>
          </b-menu-item>
        </nuxt-link>
      </b-menu-list>
    </b-menu>
    <!-- <div class="vm-placement" data-id="5ed9035bf732892da8001c6c" style="margin-top:20px"></div> -->
  </div>
</template>

<script>
const moment = require("moment");
export default {
  name: "Forums",
  props: {
    type: String
  },
  data() {
    return {
      forums: [],
      auth: undefined,
      data: [],
      isForumsReady: false,
      isMatchesReady: false,
      isNewsReady: false
    };
  },
  created() {
    this.$watch(
      () => {
        return this.isForumsReady;
      },
      (newVal, oldVal) => {
        this.data.sort(function(a, b) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
      },
      {
        deep: true
      }
    );
    this.$watch(
      () => {
        return this.isMatchesReady;
      },
      (newVal, oldVal) => {
        this.data.sort(function(a, b) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
      },
      {
        deep: true
      }
    );
    this.$watch(
      () => {
        return this.isNewsReady;
      },
      (newVal, oldVal) => {
        this.data.sort(function(a, b) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
      },
      {
        deep: true
      }
    );
    let auth = undefined;
    if (process.browser) {
      this.$aes.setKey("SECURE_VAL_PW");
      var authEnc = localStorage.getItem("auth");
      if (authEnc) {
      
      auth = JSON.parse(this.$aes.decrypt(authEnc));
      }
    }
    if (auth) {
      this.auth = auth;
    }
    this.fetchData();
  },
  methods: {
    sortData() {
      const temp = this.data.sort(function(a, b) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      return temp;
    },
    fetchData() {
      this.$axios(
        'https://macvars.herokuapp.com/' + `api/forums?$sort[updatedAt]=-1&$limit=5`,
        {
          method: "get",
          headers: {
            "content-type": "application/json"
          }
        }
      )
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            const temp = response.data[i];
            temp.type = "forums";
            if (temp.commentIds.length !== 0) {
              this.data.push(temp);
            } else {
              this.data.push(temp);
            }
            this.isForumsReady = true;
          }
        });
      this.$axios(
        'https://macvars.herokuapp.com/' + `api/matches?$sort[updatedAt]=-1&$limit=5`,
        {
          method: "get",
          headers: {
            "content-type": "application/json"
          }
        }
      )
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            const temp = response.data[i];
            temp.type = "matches";
            if (temp.commentIds.length !== 0) {
              this.data.push(temp);
            }
            this.isMatchesReady = true;
          }
        });
      this.$axios(
        'https://macvars.herokuapp.com/' + `api/news?$sort[updatedAt]=-1&$limit=5`,
        {
          method: "get",
          headers: {
            "content-type": "application/json"
          }
        }
      )
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            const temp = response.data[i];
            temp.type = "news";
            if (temp.commentIds.length !== 0) {
              this.data.push(temp);
            }
          }
          this.isNewsReady = true;
        });
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("DD/MM/YY h:mm a");
    },
    navActivity(type, id, slug) {
      this.$router.push({ path: `/${type}/${id}/${slug}` });
    },
    navLogin() {
      this.$router.push({ path: `/login` });
    },
    navRegister() {
      this.$router.push({ path: `/signup` });
    },
    navForums() {
      this.$router.push({ path: `/forums` });
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
.forum-title {
  width: 93%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
