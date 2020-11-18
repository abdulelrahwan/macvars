<template>
  <div class="hello">
    <div class="columns is-centered" style="margin-top:10px; ">
      <div class="column is-narrow">
        <div :style="{width:!$device.isMobile?'800px':'' }">
          <div class="card">
            <div class="card-content">
              <div class="title">Create Discussion</div>
              <div v-if="auth == undefined" style="text-align:right; padding:0px">
                <span @click="navLogin()" style="cursor:pointer;color:#ff726f">LOGIN</span> or
                <span @click="navRegister()" style="cursor:pointer;color:#ff726f">REGISTER</span> to post!
              </div>
              <div class="columns is-centered" v-if="auth != undefined">
                <div class="column" style="text-align:left">
                  <b-field label="Topic">
                    <b-select v-model="forum.type" expanded placeholder="Select a topic">
                      <option value="valorant" style="color:white">General discussion</option>
                      <option value="offTopic" style="color:white">Off Topic</option>
                      <option value="feedback" style="color:white">MacVarsity Feedback</option>
                    </b-select>
                  </b-field>
                  <b-field label="Title">
                    <b-input v-model="forum.title" placeholder="Title" maxlength="100"></b-input>
                  </b-field>
                  <b-field label="Body" style="padding-bottom:0px">
                    <b-input
                      maxlength="1000"
                      type="textarea"
                      v-model="forum.body"
                      style="resize:none;white-space: pre-wrap;word-wrap: break-word;"
                      icon-right="emoticon-outline"
                      icon-right-clickable
                      @icon-right-click="toogleDialogEmoji"
                    ></b-input>
                  </b-field>
                  <VEmojiPicker
                    v-show="showDialog"
                    style="background-color:#273142;position:absolute;right:0;display:block;margin-top:-150px;z-index:1000"
                    @select="selectEmoji"
                  />
                  <div style="text-align:right">
                    <b-button style="background-color:#ff726f" @click="createForum">Create</b-button>
                  </div>
                  <div>
                    <p
                      v-if="showUnacceptablePostMssg"
                      style="color:red;text-align:right"
                    >Sorry this post is not allowed.</p>
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
import VEmojiPicker from "v-emoji-picker";

const moment = require("moment");
export default {
  name: "Forums",
  props: {
    id: String
  },
  data() {
    return {
      auth: undefined,
      forum: {
        type: undefined,
        title: undefined,
        body: ""
      },
      showUnacceptablePostMssg: false,
      isBanned: false,
      showDialog: false
    };
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
        this.$axios('https://macvars.herokuapp.com/' + `users/${this.auth.user._id}`, {
          method: "get"
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            this.isBanned = response.isBanned;
          });
      }
    }
  },
  methods: {
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog;
    },
    selectEmoji(emoji) {
      this.forum.body += emoji.data;
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("DD/MM/YY h:mm a");
    },
    createForum() {
      this.showDialog = false;
      if (this.isBanned) {
        this.$buefy.snackbar.open(
          "You have been banned from posting. Contact via email to appeal."
        );
        return;
      }
      this.forum.comments = [];
      this.forum.dateTime = new Date();
      this.forum.userId = this.auth.user._id;
      let notAllowed = true;
      for (let i = 0; i < this.forum.title.length; i++) {
        if (
          this.forum.title[i] !== "*" &&
          this.forum.title[i] !== " " &&
          this.forum.title[i] !== "\n"
        ) {
          notAllowed = false;
        }
      }
      for (let i = 0; i < this.forum.body.length; i++) {
        if (
          this.forum.body[i] !== "*" &&
          this.forum.body[i] !== " " &&
          this.forum.body[i] !== "\n"
        ) {
          notAllowed = false;
        }
      }
      if (!notAllowed) {
        this.$axios(
          'https://macvars.herokuapp.com/' +
            `api/forums?$sort[updatedAt]=-1&$limit=2&userId=${this.auth.user._id}`,
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
            const forums = response.data;
            let count = 0;
            for (let i = 0; i < forums.length; i++) {
              const yesterday = moment().subtract(1, "d");
              const date = moment(forums[i].createdAt);
              if (!date.isBefore(yesterday)) {
                count += 1;
              }
              if (count >= 2) {
                this.$buefy.snackbar.open(
                  "You have reached your post limit for today!"
                );
                return;
              }
            }
            this.$axios('https://macvars.herokuapp.com/' + "api/forums", {
              method: "post",
              data: this.forum
            })
              .then(function(response) {
                return response.data;
              })
              .then(response => {
                if (response.code !== undefined) {
                  this.$buefy.snackbar.open(response.message);
                } else {
                  this.$buefy.snackbar.open("Creation successful!");
                  this.$router.push({
                    path: `/forums/${response._id}/${response.slug}`
                  });
                }
              })
              .catch(error => {
                if (error.response) {
                  if (error.response.data.message === "jwt expired") {
                    if (process.browser) {
                      localStorage.removeItem("auth");
                    }
                    window.location.reload();
                  }
                }
              });
          });
      } else {
        this.showUnacceptablePostMssg = true;
      }
    },
    navLogin() {
      this.$router.push({ path: `/login` });
    },
    navRegister() {
      this.$router.push({ path: `/signup` });
    }
  },
  components: { VEmojiPicker }
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
</style>
