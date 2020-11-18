<template >
  <div class="card" style="padding:0px" v-if="!loading">
    <div class="card-content" style="padding:0px" :key="inc">
      <p style="text-align:left;padding:15px;font-size:18px;padding-bottom:0px">
        <vue-markdown>Comments</vue-markdown>
      </p>
      <CommentTree
        :comment="commentsArray"
        :depth="0"
        :parent="commentsArray"
        :id="id"
        :type="type"
        :pageData="pageData"
        :newUser="newUser"
      />
      <!-- <b-table :mobile-cards="false" :data="commentsArray" :striped="true" :hoverable="true">
        <template slot-scope="props">
          <b-table-column
            field="id"
            :ref="props.row._id.toString()"
            :id="props.row._id.toString()"
            v-bind:class="shouldHighlight(props.row._id)"
          >
            <div class="comment-mobile">
              <span v-if="props.row.user.hasOwnProperty('flag') && props.row.user.flag !== ''">
                <country-flag
                  v-bind:country="props.row.user.flag"
                  size="small"
                  style="vertical-align:-15px; margin-left:-20px; margin-right:-15px"
                />
              </span>
              <span v-if="!props.row.user.hasOwnProperty('flag') || props.row.user.flag === ''">
                <country-flag
                  country="un"
                  size="small"
                  style="vertical-align:-15px; margin-left:-20px; margin-right:-15px"
                />
              </span>
              <b
                style="cursor:pointer"
                @click="navUser(props.row.user._id)"
                v-bind:class="isAdmin(props.row.user)"
              >{{props.row.user.username}}</b>
            </div>
            <div class="word-mobile" style="word-wrap: break-word;">
              <span
                v-if="props.row.replyComment"
                style="color:#8c67ef;cursor:pointer"
                @click="selectedReply = props.row.replyComment;clickAt(props.row.replyComment)"
              >@{{getComment(props.row.replyComment).user.username}}</span>
              <vue-markdown>{{props.row.text}}</vue-markdown>
            </div>
            <div
              style="font-size:11px;text-align:right;cursor:pointer"
              @click="replyComment = props.row;scrollBottom()"
            >
              <b-icon icon="message-reply-text"></b-icon>
              <span>{{props.row._id.slice(-2).toUpperCase()}}</span>
              <div>{{formatDate(props.row.createdAt)}}</div>
            </div>
            <CommentTree :comment="props.row.replies" :depth="0" />
          </b-table-column>
        </template>
      </b-table>-->

      <div v-if="auth">
        <div v-if="replyComment" style="text-align:left;margin-left:20px;">
          You are replying to:
          <span
            style="font-weight:bold"
          >{{replyComment.user.username}} - {{replyComment._id.slice(-2).toUpperCase()}}</span>
          <i
            style="color:red; margin-left:20px;cursor:pointer"
            class="fas fa-times"
            @click="replyComment=undefined"
          ></i>
        </div>
        <b-field label="Leave a Comment" style="padding:10px">
          <b-input
            v-model="comment.text"
            maxlength="1500"
            type="textarea"
            style="resize:none;white-space: pre-wrap;word-wrap: break-word;"
            icon-right="emoticon-outline"
            icon-right-clickable
            @icon-right-click="toogleDialogEmoji"
          ></b-input>
        </b-field>
        <VEmojiPicker
          v-show="showDialog"
          style="background-color:#273142;position:absolute;right:0;display:block;margin-top:-100px;z-index:1000"
          @select="selectEmoji"
        />
        <div style>
          <b-button
            style="background-color:#ff726f;margin-top:-30px"
            @click="submitComment"
            id="test"
            :disabled="buttonDisabled"
          >Submit</b-button>
        </div>
        <div>
          <p v-if="showUnacceptableCommentMssg" style="color:red">Sorry this message is not allowed.</p>
        </div>
      </div>
      <div v-if="!auth" style="margin-top:20px;font-weight:bold">
        <span @click="navLogin()" style="cursor:pointer;color:#ff726f">LOGIN</span> or
        <span @click="navRegister()" style="cursor:pointer;color:#ff726f">REGISTER</span> to comment!
      </div>
    </div>
  </div>
</template>

<script>
import CommentTree from "./CommentTree";
import VEmojiPicker from "v-emoji-picker";
import VueMarkdown from "vue-markdown";
const moment = require("moment");
export default {
  name: "Characters",
  props: {
    id: String,
    type: String,
    commentsArray: Array,
    pageData: Object
  },
  data() {
    return {
      auth: undefined,
      comment: {
        text: ""
      },
      data: [],
      users: {},
      buttonDisabled: false,
      showUnacceptableCommentMssg: false,
      isBanned: false,
      replyComment: undefined,
      selectedReply: undefined,
      commentsObj: {},
      inc: 0,
      forum: undefined,
      match: undefined,
      newUser: undefined,
      loading: true,
      showDialog: false
    };
  },
  created() {
    this.$nextTick(function() {
      this.loading = false;
    });
  },
  mounted() {
    if (process.browser) {
      this.$aes.setKey("SECURE_VAL_PW");
      var authEnc = localStorage.getItem("auth");
      if (authEnc) {
        let auth = JSON.parse(this.$aes.decrypt(authEnc));
        if (auth) {
          this.auth = auth;
          this.comment.userId = auth.user._id;
          this.$axios('https://macvars.herokuapp.com/' + `users/${this.auth.user._id}`, {
            method: "get"
          })
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              this.newUser = response;
              this.isBanned = response.isBanned;
            });
        }
      }
    }
  },
  methods: {
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog;
    },
    selectEmoji(emoji) {
      this.comment.text += emoji.data;
    },
    getComment(id) {
      for (let i = 0; i < this.commentsArray.length; i++) {
        if (this.commentsArray[i]._id === id) {
          return this.commentsArray[i];
        }
      }
    },
    isAdmin(user) {
      if (user.permissions.length > 0 && user.permissions[0] === "admin") {
        return "admin";
      }
      return "user";
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("DD-MM-YYYY h:mm a");
    },
    navLogin() {
      this.$router.push({ path: `/login` });
    },
    navRegister() {
      this.$router.push({ path: `/signup` });
    },
    navUser(id) {
      this.$router.push({ path: `/user/${id}` });
    },
    submitComment() {
      this.showDialog = false;
      if (this.isBanned) {
        this.$buefy.snackbar.open(
          "You have been banned from posting. Contact via email to appeal."
        );
        return;
      }
      this.buttonDisabled = true;
      this.comment.dateTime = new Date();
      let newCommentId = "";
      this.comment.text = this.filterBadwords(this.comment.text);
      let notAllowed = true;
      for (let i = 0; i < this.comment.text.length; i++) {
        if (
          this.comment.text[i] !== "*" &&
          this.comment.text[i] !== " " &&
          this.comment.text[i] !== "\n"
        ) {
          notAllowed = false;
        }
      }
      if (!notAllowed) {
        this.comment.replyComment = this.replyComment;
        this.comment.repliesId = [];
        this.$axios('https://macvars.herokuapp.com/' + `api/comments`, {
          method: "post",
          data: this.comment
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            if (response.code !== undefined) {
              this.$buefy.snackbar.open(response.message);
              this.buttonDisabled = true;
            } else {
              newCommentId = response._id;
              this.$axios(
                'https://macvars.herokuapp.com/' +
                  `api/${this.type}/${this.id}?&populateuser=true`,
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
                  if (response.code !== undefined) {
                    this.buttonDisabled = true;
                    this.$buefy.snackbar.open(response.message);
                  } else {
                    if (this.type === "forums") {
                      this.forum = response;
                    }
                    if (this.type === "matches") {
                      this.match = response;
                    }
                    const newData = response;
                    newData.commentIds.push(newCommentId);
                    if (newData.numComments) {
                      newData.numComments += 1;
                    } else {
                      newData.numComments = newData.commentIds.length;
                    }
                    this.$axios(
                      'https://macvars.herokuapp.com/' + `api/${this.type}/${this.id}`,
                      {
                        method: "patch",
                        headers: new Headers({
                          "content-type": "application/json"
                        }),
                        data: newData
                      }
                    )
                      .then(function(response) {
                        return response.data;
                      })
                      .then(response => {
                        this.buttonDisabled = true;
                        if (response.code !== undefined) {
                          this.$buefy.snackbar.open(response.message);
                          this.buttonDisabled = false;
                        } else {
                          if (this.type === "forums") {
                            this.sendForumNotif(response);
                            if (this.replyComment !== undefined) {
                              this.sendAtMsgNotif(response);
                            }
                          }
                          if (this.type === "matches") {
                            if (this.replyComment !== undefined) {
                              this.sendAtMsgNotifMatches(response);
                            }
                          }
                          if (this.type === "news") {
                            if (this.replyComment !== undefined) {
                              this.sendAtMsgNotifNews(response);
                            }
                          }
                          window.location.reload();
                        }
                      });
                  }
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
      } else {
        this.showUnacceptableCommentMssg = true;
        this.buttonDisabled = false;
      }
    },
    sendAtMsgNotifNews(news) {
      // Send notif to guy who got @d
      if (this.replyComment.user.notifications[this.id]) {
        this.replyComment.user.notifications[this.id].dateTime = news.updatedAt;
      } else {
        this.replyComment.user.notifications[this.id] = {
          type: this.type,
          dateTime: news.updatedAt,
          text: "Someone has replied to you on a news post!",
          slug: news.slug
        };
      }
      this.$axios('https://macvars.herokuapp.com/' + `users/${this.replyComment.user._id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: this.replyComment.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {});
    },
    sendAtMsgNotifMatches(match) {
      // Send notif to guy who got @d
      if (this.replyComment.user.notifications[this.id]) {
        this.replyComment.user.notifications[this.id].dateTime =
          match.updatedAt;
      } else {
        this.replyComment.user.notifications[this.id] = {
          type: this.type,
          dateTime: match.updatedAt,
          text: "Someone has replied to you on a match post!",
          slug: match.slug
        };
      }
      this.$axios('https://macvars.herokuapp.com/' + `users/${this.replyComment.user._id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: this.replyComment.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {});
    },
    sendAtMsgNotif(forum) {
      if (this.forum.user._id === this.replyComment.user._id) {
        return;
      }
      // Send notif to guy who got @d
      if (this.replyComment.user.notifications[this.id]) {
        this.replyComment.user.notifications[this.id].dateTime =
          forum.updatedAt;
      } else {
        this.replyComment.user.notifications[this.id] = {
          type: this.type,
          dateTime: forum.updatedAt,
          text: "Someone has replied to you on a forum post!",
          slug: forum.slug
        };
      }
      this.$axios('https://macvars.herokuapp.com/' + `users/${this.replyComment.user._id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: this.replyComment.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {});
    },
    sendForumNotif(forum) {
      if (this.forum.user._id === this.comment.userId) {
        return;
      }
      // Send notification to forum poster
      if (this.forum.user.notifications[this.id]) {
        this.forum.user.notifications[this.id].dateTime = forum.updatedAt;
      } else {
        this.forum.user.notifications[this.id] = {
          type: this.type,
          dateTime: forum.updatedAt,
          text: "Someone has commented on a forum post you created!"
        };
      }
      this.$axios('https://macvars.herokuapp.com/' + `users/${this.forum.user._id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: this.forum.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {});
    },
    filterBadwords(text) {
      const badWords = new Set([
        "nigger",
        "nigar",
        "niggar",
        "niger",
        "n1ger",
        "n1gger",
        "n1ggar",
        "nigga",
        "negar",
        "neggar",
        "faggot",
        "faggit",
        "fagot",
        "nigerr",
        "nigarr",
        "fagott",
        "faggit"
      ]);
      text = text.trim().split(" ");
      for (let i = 0; i < text.length; i++) {
        if (badWords.has(text[i].toLowerCase())) {
          text[i] = "******";
        }
      }
      text = text.join(" ");
      return text;
    },
    reply() {},
    shouldHighlight(id) {
      setTimeout(() => {
        this.selectedReply = undefined;
      }, 4000);
      if (this.selectedReply && id === this.selectedReply) {
        return "bkg-highlight";
      }
      return "";
    },
    clickAt(id) {
      document.getElementById(id).scrollIntoView();
      window.scrollBy(0, -100);
    },
    scrollBottom() {
      window.scrollTo(0, document.body.scrollHeight);
    }
  },
  components: { VueMarkdown, CommentTree, VEmojiPicker }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.textarea {
  resize: none !important;
}
@media screen and (max-width: 640px) {
  .comment-mobile {
    text-align: left;
  }
  .word-mobile {
    width: 350px;
  }
}

.admin {
  color: green;
}
.bkg-highlight {
  background-color: #171e29;
  border-color: #8c67ef !important;
  border-width: 1px !important;
  border-style: solid !important;
}
.table thead {
  display: none;
}
</style>
