<template>
  <div class="hello">
    <div class="columns is-centered" style="margin-top:10px; ">
      <!-- <div v-if="!$device.isMobile" class="column is-narrow">
        <div :style="{width:!$device.isMobile?'200px':'' }">
          <SideEvents style="font-size:14px" />
        </div>
      </div> -->
      <div class="column is-narrow">
        <div :style="{width:!$device.isMobile?'800px':'' }">
          <div class="card">
            <div class="card-content">
              <h1 class="title">{{forum.title}}</h1>
              <div>{{formatDate(forum.updatedAt)}}</div>
              <div
                v-if="forum.user"
                style="font-weight:bold;cursor:pointer"
                @click="navUser(forum.user._id)"
                v-bind:class="isAdmin(forum.user)"
              >
                <span v-if="forum.user.hasOwnProperty('flag') && forum.user.flag !== ''">
                  <country-flag
                    v-bind:country="forum.user.flag"
                    size="normal"
                    style="vertical-align:-15px; margin-left:-20px; margin-right:-15px"
                  />
                </span>
                <span v-if="!forum.user.hasOwnProperty('flag') || forum.user.flag === ''">
                  <country-flag
                    country="un"
                    size="normal"
                    style="vertical-align:-15px; margin-left:-20px; margin-right:-15px"
                  />
                </span>
                {{forum.user.username}}
              </div>
              <div
                v-if="forum.body"
                style="margin-top:20px; padding:10px; overflow-wrap: break-word"
              >
                <vue-markdown :html="false" style="text-align:left">{{forum.body}}</vue-markdown>
              </div>
              <div v-if="auth" style="margin-top:50px">
                <div v-if="auth.user.permissions.includes('moderator')">
                  <div class="columns" style="text-align:left">
                    <div style="padding-right:0px;text-align:left">
                      <b-field>
                        <b-select
                          style="text-align:right"
                          placeholder="Select a character"
                          v-model="forumTopic"
                        >
                          <option style="color:white" value="valorant">General discussions</option>
                          <option style="color:white" value="feedback">MacVarsity Feedback</option>
                          <option style="color:white" value="offTopic">Off-Topic</option>
                        </b-select>
                      </b-field>
                    </div>
                    <div style="text-align:left;padding-right:0px;margin-left:30px">
                      <b-button style="margin-left:0px" v-on:click="movePost()">Move post</b-button>
                    </div>
                    <div style="text-align:left;margin-left:80px">
                      <b-button style="margin-left:0px" v-on:click="deletePost()">Delete post</b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <client-only>
            <div class="columns is-centered" style="margin-top:10px">
              <div class="column is-narrow">
                <div :style="{width:!$device.isMobile?'800px':'' }">
                  <Comments
                    :id="$route.params.id"
                    type="forums"
                    :commentsArray="forum.comments"
                    :pageData="forum"
                  />
                </div>
              </div>
            </div>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Comments from "../../../components/Comments/Comments";
import VueMarkdown from "vue-markdown";
const moment = require("moment");
export default {
  name: "Forums",
  props: {
    id: String
  },
  data() {
    return {
      forumsSkip: 0,
      forumsTotal: 0,
      forumTopic: "",
      auth: ""
    };
  },
  head() {
    return {
      title: "Forum | " + this.forum.title
    };
  },
  asyncData({ params, $axios }) {
    return $axios
      .get(
        'https://macvars.herokuapp.com/' +
          `api/forums/${params.id}?&populatecomments=true&populateuser=true`
      )
      .then(response => {
        return { forum: response.data };
      })
      .catch(err => console.log(err));
  },
  mounted() {
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
  },
  methods: {
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("DD/MM/YY h:mm a");
    },
    navUser(id) {
      this.$router.push({ path: `/user/${id}` });
    },
    isAdmin(user) {
      if (user.permissions.length > 0 && user.permissions[0] === "admin") {
        return "admin";
      } else if (
        user &&
        user.permissions.length > 0 &&
        user.permissions.includes("moderator")
      ) {
        return "moderator";
      }
      return "user";
    },
    deletePost() {
      this.$buefy.dialog.confirm({
        message: "Are you sure you want to delete this post?",
        type: "is-dark",
        onConfirm: () => {
          this.$axios(
            'https://macvars.herokuapp.com/' + `api/forums/${this.$route.params.id}`,
            {
              method: "delete",
              headers: new Headers({
                "content-type": "application/json"
              })
            }
          )
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              this.navToForumsHome();
            });
        }
      });
    },
    navToForumsHome() {
      this.$router.push({ path: `/forums/` });
    },
    movePost() {
      if (this.forumTopic !== "") {
        this.$buefy.dialog.confirm({
          message:
            "Are you sure you want to move this post to " +
            this.forumTopic +
            "?",
          type: "is-dark",
          onConfirm: () => {
            this.$axios(
              'https://macvars.herokuapp.com/' + `api/forums/${this.$route.params.id}`,
              {
                method: "patch",
                headers: {
                  "content-type": "application/json"
                },
                data: { type: this.forumTopic }
              }
            )
              .then(function(response) {
                return response.data;
              })
              .then(response => {
                this.navToForumsHome();
              });
          }
        });
      }
    }
  },
  components: { Comments, VueMarkdown }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.textarea {
  resize: none !important;
}
@media screen and (max-width: 640px) {
  .comment-mobile {
    text-align: left;
  }
}
.admin {
  color: lightgreen;
}
.moderator {
  color: skyblue;
}
</style>
