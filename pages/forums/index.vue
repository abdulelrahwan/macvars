<template>
  <div class="hello">
    <h1 style="font-size:50px;margin-bottom:20px">MacVarsity Forums</h1>

    <div class="columns is-centered">
      <div class="column is-two-thirds">
        <div class="columns is-centered">
          <div class="column is-narrow" :key="selectedType">
            <div :style="{width:!$device.isMobile?'800px':'' }">
              <div style="text-align:left;cursor:pointer">
                <span @click="selectedType = undefined">Forum Topics</span>
                <span v-if="selectedType">-> {{selectedType}}</span>
              </div>
              <div class="columns" style="margin-top:10px; " v-if="selectedType === undefined">
                <div class="column is-full">
                  <div class="card">
                    <div class="card-content">
                      <b-table
                        @click="(row)=>selectedType = row.title"
                        :data="topics"
                        :striped="true"
                        :hoverable="true"
                        style="cursor:pointer;font-size:14px"
                        :mobile-cards="false"
                      >
                        <template slot-scope="props">
                          <b-table-column label="Title" field="title" style="cursor:pointer;">
                            <div
                              style="width:200px;text-align:left;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;font-size:18px"
                            >{{props.row.title}}</div>
                            <div
                              v-if="!$device.isMobile"
                              style="font-size:13px;color:#cccccc;"
                            >{{props.row.description}}</div>
                            <div
                              v-if="$device.isMobile"
                              style="font-size:13px;color:#cccccc;width:200px"
                            >{{props.row.description}}</div>
                          </b-table-column>
                          <b-table-column
                            class="mobile-fields"
                            label="Last Updated"
                            field="updated"
                            style="cursor:pointer"
                          >
                            <div
                              style="text-align:left"
                              v-if="props.row.title === 'Valorant' && forums[0]"
                            >{{transformDate(forums[0].updatedAt)}}</div>
                            <div
                              style="text-align:left"
                              v-if="props.row.title === 'Off Topic' && offTopicForums[0]"
                            >{{transformDate(offTopicForums[0].updatedAt)}}</div>
                          </b-table-column>
                        </template>
                      </b-table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns" style="margin-top:10px; " v-if="selectedType === 'Valorant'">
                <div class="column is-full">
                  <div class="card">
                    <div class="card-content">
                      <div v-if="auth == undefined" style="text-align:right; padding:0px">
                        <span @click="navLogin()" style="cursor:pointer;color:#ff726f">LOGIN</span> or
                        <span
                          @click="navRegister()"
                          style="cursor:pointer;color:#ff726f"
                        >REGISTER</span> to post!
                      </div>
                      <div v-if="auth!=undefined" style="text-align:right; padding:0px">
                        <b-button style="background-color:#ff726f" @click="navCreate">Create</b-button>
                      </div>
                      <b-table
                        @click="(row)=>navForum(row._id, row.slug)"
                        :data="forums"
                        :striped="true"
                        :hoverable="true"
                        style="cursor:pointer;font-size:14px"
                        :mobile-cards="false"
                      >
                        <template slot-scope="props">
                          <b-table-column label="Title" field="title" style="cursor:pointer;">
                            <div
                              style="width:220px;text-align:left;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;"
                            >{{props.row.title}}</div>
                          </b-table-column>
                          <b-table-column
                            class="mobile-fields"
                            label="User"
                            field="users"
                            style="cursor:pointer"
                            :visible="!$device.isMobile"
                          >
                            <div
                              style="width:100px;text-align:left;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;"
                            >{{props.row.user.username}}</div>
                          </b-table-column>
                          <b-table-column
                            class="mobile-fields"
                            label="Last Updated"
                            field="updatedAt"
                            style="cursor:pointer"
                            v-if="props.row.updatedAt"
                          >
                            <div style="text-align:left">{{transformDate(props.row.updatedAt)}}</div>
                          </b-table-column>
                        </template>
                      </b-table>
                      <div class="card" v-if="forums.length != forumsTotal">
                        <div
                          class="card-content"
                          style="color:#ff726f;cursor:pointer"
                          @click="forumsSkip+=10;fetchForums(forumsSkip)"
                        >Show More</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns" style="margin-top:10px; " v-if="selectedType === 'Off Topic'">
                <div class="column is-full">
                  <div class="card">
                    <div class="card-content">
                      <div v-if="auth == undefined" style="text-align:right; padding:0px">
                        <span @click="navLogin()" style="cursor:pointer;color:#ff726f">LOGIN</span> or
                        <span
                          @click="navRegister()"
                          style="cursor:pointer;color:#ff726f"
                        >REGISTER</span> to post!
                      </div>
                      <div v-if="auth!=undefined" style="text-align:right; padding:0px">
                        <b-button style="background-color:#ff726f" @click="navCreate">Create</b-button>
                      </div>
                      <b-table
                        @click="(row)=>navForum(row._id, row.slug)"
                        :data="offTopicForums"
                        :striped="true"
                        :hoverable="true"
                        style="cursor:pointer;font-size:14px"
                        :mobile-cards="false"
                      >
                        <template slot-scope="props">
                          <b-table-column label="Title" field="title" style="cursor:pointer">
                            <div
                              style="width:220px;text-align:left;overflow:hidden;text-overflow: ellipsis;white-space: nowrap"
                            >{{props.row.title}}</div>
                          </b-table-column>
                          <b-table-column
                            class="mobile-fields"
                            label="User"
                            field="user"
                            style="cursor:pointer"
                            :visible="!$device.isMobile"
                          >
                            <div
                              style="width:100px;text-align:left;overflow:hidden;text-overflow: ellipsis;white-space: nowrap"
                            >{{props.row.user.username}}</div>
                          </b-table-column>
                          <b-table-column
                            class="mobile-fields"
                            label="Last Updated"
                            field="updated"
                            style="cursor:pointer"
                          >
                            <div style="text-align:left">{{transformDate(props.row.updatedAt)}}</div>
                          </b-table-column>
                        </template>
                      </b-table>
                      <div class="card" v-if="offTopicForums.length != offTopicForumsTotal">
                        <div
                          class="card-content"
                          style="color:#ff726f;cursor:pointer"
                          @click="offTopicForumsSkip+=10;fetchOffTopic(offTopicForumsSkip)"
                        >Show More</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import async from "async";
import axios from "axios";
const moment = require("moment");
export default {
  name: "Forums",
  props: {
    type: String
  },
  data() {
    return {
      auth: undefined
    };
  },
  asyncData() {
    // variable definition
    var forums = [];
    var forumsSkip = 0;
    var forumsTotal = 0;
    var feedbackForums = [];
    var feedbackForumsSkip = 0;
    var feedbackForumsTotal = 0;
    var offTopicForums = [];
    var offTopicForumsSkip = 0;
    var offTopicForumsTotal = 0;
    var selectedType = undefined;
    var topics = [
      {
        title: "General discussions",
        description: "Discussions regarding anything Mac Varsity related."
      },
      {
        title: "Off Topic",
        description: "Discussions regarding anything unrelated to Mac Varsity."
      },
      {
        title: "MacVarsity Feedback",
        description:
          "Discussions regarding any feedback or changes you want to see on this site."
      }
    ];
    // variable definition end
    //data fetch
    return axios
      .all([
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/forums?$sort[updatedAt]=-1&$limit=10&$skip=${forumsSkip}&type=valorant&populateuser=true`
        ),
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/forums?$sort[updatedAt]=-1&$limit=10&$skip=${feedbackForumsSkip}&type=feedback&populateuser=true`
        ),
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/forums?$sort[updatedAt]=-1&$limit=10&$skip=${offTopicForumsSkip}&type=offTopic&populateuser=true`
        )
      ])
      .then(
        axios.spread((forumsRaw, feedbackRaw, offTopicRaw) => {
          var forumResponse = forumsRaw.data;
          var feedbackResponse = feedbackRaw.data;
          var offTopicResponse = offTopicRaw.data;

          //forums
          forums.push(...forumResponse.data);
          forumsTotal = forumResponse.total;

          //feedback
          feedbackForums.push(...feedbackResponse.data);
          feedbackForumsTotal = feedbackResponse.total;

          //offTopic
          offTopicForums.push(...offTopicResponse.data);
          offTopicForumsTotal = offTopicResponse.total;

          return {
            forums,
            forumsSkip,
            forumsTotal,
            feedbackForums,
            feedbackForumsSkip,
            feedbackForumsTotal,
            offTopicForums,
            offTopicForumsSkip,
            offTopicForumsTotal,
            selectedType,
            topics
          };
        })
      )
      .catch(err => console.log(err));
  },
  created() {
    if (process.browser) {
     this.$aes.setKey("SECURE_VAL_PW");
      var authEnc = localStorage.getItem("auth");
        if (authEnc) {
      let auth = JSON.parse(this.$aes.decrypt(authEnc));
      if (auth) {
        this.auth = auth;
      }
        }
    }
  },
  methods: {
    fetchForums(skip) {
      this.$axios(
        'https://macvars.herokuapp.com/' +
          `api/forums?$sort[updatedAt]=-1&$limit=10&$skip=${skip}&type=valorant&populateuser=true`,
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
          this.forums.push(...response.data);
          this.forumsTotal = response.total;
        });
    },
    fetchFeedback(skip) {
      this.$axios(
        'https://macvars.herokuapp.com/' +
          `api/forums?$sort[updatedAt]=-1&$limit=10&$skip=${skip}&type=feedback&populateuser=true`,
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
          this.feedbackForums.push(...response.data);
          this.feedbackForumsTotal = response.total;
        });
    },
    fetchOffTopic(skip) {
      this.$axios(
        'https://macvars.herokuapp.com/' +
          `api/forums?$sort[updatedAt]=-1&$limit=10&$skip=${skip}&type=offTopic&populateuser=true`,
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
          this.offTopicForums.push(...response.data);
          this.offTopicForumsTotal = response.total;
        });
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("DD/MM/YY h:mm a");
    },
    navForum(id, slug) {
      this.$router.push({ path: `/forums/${id}/${slug}` });
    },
    navLogin() {
      this.$router.push({ path: `/login` });
    },
    navRegister() {
      this.$router.push({ path: `/signup` });
    },
    navCreate() {
      this.$router.push({ path: `/forums/create` });
    },
    transformDate(givenDate) {
      if (
        moment()
          .subtract(7, "days")
          .valueOf() > moment(givenDate).valueOf()
      ) {
        return moment(givenDate).format("ll");
      } else if (
        moment()
          .subtract(1, "days")
          .valueOf() > moment(givenDate).valueOf()
      ) {
        return moment(givenDate).calendar();
      } else {
        return moment(givenDate).fromNow();
      }
    }
  },
  components: { }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css?family=Titillium+Web");

@import "~bulma/sass/utilities/_all";
$border: #ff726f;
.type-button {
  width: 150px;
}
.button {
  margin-top: 20px;
  margin-bottom: 20px;
}

@media only screen and (min-width: 600px) {
  .mobile-fields {
    width: 200px;
  }
}
.table td {
  // border: 1px solid #ff726f !important;
  border-color: #ff726f !important;
}
.table td,
.table th {
  border-color: #ff726f !important;
}
.table {
  border-color: #ff726f !important;
}
</style>
