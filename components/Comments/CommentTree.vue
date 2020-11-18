<template>
  <div :key="inc" v-if="!loading">
    <div style="text-align:left;padding:20px" v-if="!comment">
      <b-skeleton width="20%" :animated="true"></b-skeleton>
      <b-skeleton width="40%" :animated="true"></b-skeleton>
      <b-skeleton width="80%" :animated="true"></b-skeleton>
      <b-skeleton :animated="true"></b-skeleton>
    </div>
    <b-table
      v-if="comment"
      :mobile-cards="false"
      :data="comment"
      :striped="true"
      :hoverable="false"
      style="padding-top:0px;border: 0px solid #dbdbdb;"
    >
      <template slot-scope="props">
        <div style="margin-top:5px"></div>
        <b-table-column
          field="id"
          style="display:block;padding-top:0px;background-color:#202836;"
          :style="{'margin-left':depth*20 + 'px',width:'100%'-500+'px','margin-top':depth==0?'0px':'-16px'}"
        >
          <div v-if="props.row.type" style="width:100%" id="newComment">
            <div style="padding:10px">
              <b-input
                v-model="newComment.text"
                maxlength="1500"
                type="textarea"
                style="resize:none;white-space: pre-wrap;word-wrap: break-word;height:150px"
                icon-right="emoticon-outline"
                icon-right-clickable
                @icon-right-click="toogleDialogEmoji"
              ></b-input>
            </div>
            <VEmojiPicker
              v-show="showDialog"
              style="background-color:#273142;position:absolute;right:0;display:block;margin-top:-100px;z-index:1000"
              @select="selectEmoji"
            />
            <div style="margin-left:20px">
              <b-button
                style="background-color:#ff726f;margin-top:-100px+"
                @click="submitComment"
                id="test"
                :disabled="buttonDisabled"
              >Reply</b-button>
            </div>
            <div>
              <p
                v-if="showUnacceptableCommentMssg"
                style="color:red"
              >Sorry this message is not allowed.</p>
            </div>
          </div>
          <div v-if="props.row.type === undefined">
            <div class="comment-mobile">
              <span v-if="props.row.user && props.row.user.flag !== ''">
                <country-flag
                  v-bind:country="props.row.user.flag"
                  size="normal"
                  style="vertical-align:-15px; margin-left:-20px; margin-right:-5px"
                />
              </span>
              <span v-if="!props.row.user || props.row.user.flag === ''">
                <country-flag
                  country="un"
                  size="normal"
                  style="vertical-align:-15px; margin-left:-20px; margin-right:-5px"
                />
              </span>
              <b
                style="cursor:pointer"
                @click="navUser(props.row.user._id)"
                v-bind:class="isAdmin(props.row.user)"
              >{{props.row.user.username}}</b>
              <span
                style="margin-left:5px;"
                v-if="props.row.user.favPlayer && props.row.user.favPlayer.name"
              >
                |
                <span style="opacity:0.8">
                  <b-icon icon="heart" size="is-small" style="color:#ff726f"></b-icon>
                  {{props.row.user.favPlayer.name}}
                </span>
              </span>
            </div>
            <div class="word-mobile" style="word-wrap: break-word;">
              <span
                v-if="props.row.replyComment"
                style="color:#8c67ef;cursor:pointer;max-width:200px;word-wrap: break-word;"
                @click="selectedReply = props.row.replyComment;clickAt(props.row.replyComment)"
              >@{{getComment(props.row.replyComment).user.username}}</span>
              <div v-if="props.row.isRemoved && props.row.isRemoved===true">
                <p style="color:red">
                  <i>This comment has been deleted</i>
                </p>
              </div>
              <div v-if="props.row.isRemoved == undefined || props.row.isRemoved!==true">
                <vue-markdown :html="false">{{props.row.text}}</vue-markdown>
              </div>
            </div>
            <div v-if="newUser" style="margin-right:12px">
              <div
                v-if="newUser.permissions.includes('moderator') && (props.row.isRemoved == undefined || props.row.isRemoved!==true) "
                style="text-align:right"
              >
                <b-icon
                  icon="delete"
                  size="is-primary"
                  style="cursor:pointer"
                  @click.native="deleteComment(props.row)"
                ></b-icon>
              </div>
            </div>
            <div v-if="props.row.isRemoved == undefined || props.row.isRemoved!==true">
              <div
                style="font-size:11px;text-align:right;cursor:pointer;"
                class="icon-comment"
                @click="reply(props.row,depth)"
              >
                <b-icon icon="message-reply-text"></b-icon>
                <!-- <span v-if="props.row._id">{{props.row._id.slice(-2).toUpperCase()}}</span> -->
                <div>{{formatDate(props.row.createdAt)}}</div>
              </div>
            </div>
            <div
              v-if="props.row.isRemoved && props.row.isRemoved===true"
              style="font-size:11px;text-align:right"
            >{{formatDate(props.row.createdAt)}}</div>
            <!-- <div
          v-if="props.row.replies && props.row.replies.length!=0"
          style="width:1px;background-color:#ff726f;position:absolute;margin-top:20px;z-index:100"
          :style="{'height':'100%'}"
            ></div>-->
          </div>
        </b-table-column>
        <div v-if="props.row.replies && props.row.replies.length">
          <node
            v-for="(childComment, index) in props.row.replies"
            :comment="[childComment]"
            :parent="comment"
            :index="index"
            :depth="depth+1"
            :key="index"
            :pageData="pageData"
            :type="type"
            :id="id"
            :newUser="newUser"
          ></node>
        </div>
        <div style="margin-top:3px"></div>
      </template>
    </b-table>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import VEmojiPicker from "v-emoji-picker";
import store from "../../store.js";

const moment = require("moment");

export default {
  name: "node",
  props: {
    comment: Array,
    depth: Number,
    parent: Array,
    index: Number,
    id: String,
    type: String,
    pageData: Object,
    newUser: Object
  },
  data() {
    return {
      inc: 0,
      prevReply: "",
      buttonDisabled: false,
      showUnacceptableCommentMssg: false,
      auth: undefined,
      newComment: {
        text: ""
      },
      isBanned: false,
      isReady: false,
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
    if (this.comment && this.comment[0]) {
      this.isReady = true;
    }
    let auth = undefined;
    if (process.browser) {
      this.$aes.setKey("SECURE_VAL_PW");
      var authEnc = localStorage.getItem("auth");
      if (authEnc) {
        auth = JSON.parse(this.$aes.decrypt(authEnc));
      }
    }
    if (this.newUser) {
      this.auth = this.newUser;
      this.newComment.userId = auth.user._id;
    }
  },
  methods: {
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog;
    },
    selectEmoji(emoji) {
      this.newComment.text += emoji.data;
    },
    getComment(id) {
      for (let i = 0; i < this.comment.length; i++) {
        if (this.comment[i]._id === id) {
          return this.comment[i];
        }
      }
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("DD-MM-YYYY h:mm a");
    },
    reply(row, depth) {
      this.showDialog = false;
      if (this.newUser.isBanned) {
        this.$buefy.snackbar.open("You have been banned from posting");
        return;
      }
      if (depth === 7) {
        this.$buefy.snackbar.open("Comment depth limit reached");
        return;
      }
      const prevComment = store.getters.getComment;
      if (prevComment.replies) {
        prevComment.replies.pop();
      }
      store.dispatch("ChangeComment", row);
      if (!row.replies) {
        row.replies = [];
      }
      row.replies.push({
        type: "reply",
        userId: "5e97c24346719d261d32c912",
        text: "yess",
        replies: [],
        dateTime: "2020-05-09T19:50:00.927Z",
        createdAt: {
          $date: "2020-05-09T19:50:00.935Z"
        },
        updatedAt: {
          $date: "2020-05-09T19:50:00.935Z"
        },
        __v: 0
      });
      this.inc += 1;
      setTimeout(function() {
        document.getElementById("newComment").scrollIntoView();
        window.scrollBy(0, -400);
      }, 0);
    },
    isAdmin(user) {
      if (
        user &&
        user.permissions.length > 0 &&
        user.permissions[0] === "admin"
      ) {
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
    submitComment() {
      this.showDialog = false;
      this.buttonDisabled = true;
      if (this.newUser.isBanned) {
        this.buttonDisabled = false;
        this.$buefy.snackbar.open(
          "You have been banned from posting. Contact via email to appeal."
        );
        return;
      }
      const parentComment = store.getters.getComment;
      this.newComment.dateTime = new Date();
      this.$axios('https://macvars.herokuapp.com/' + `api/comments`, {
        method: "post",
        data: this.newComment
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          if (!parentComment.repliesId) {
            parentComment.repliesId = [];
          }
          parentComment.repliesId.push(response._id);
          this.$axios(
            'https://macvars.herokuapp.com/' + `api/comments/` + parentComment._id,
            {
              method: "patch",
              data: parentComment
            }
          )
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              if (this.pageData.numComments) {
                this.pageData.numComments += 1;
              } else {
                this.pageData.numComments = this.pageData.commentIds.length;
              }
              this.$axios('https://macvars.herokuapp.com/' + `api/${this.type}/${this.id}`, {
                method: "patch",
                headers: new Headers({
                  "content-type": "application/json"
                }),
                data: this.pageData
              })
                .then(function(response) {
                  return response.data;
                })
                .then(response => {});
              if (this.type === "forums") {
                this.sendAtMsgNotif(response);
              }

              if (this.type === "matches") {
                this.sendAtMsgNotifMatches(response);
              }
              if (this.type === "news") {
                this.sendAtMsgNotifNews(response);
              }
              window.location.reload();
            });
        });
    },
    sendAtMsgNotifNews(news) {
      // Send notif to guy who got @d
      const prevComment = store.getters.getComment;
      if (prevComment.user.notifications[this.id]) {
        prevComment.user.notifications[
          this.id
        ].dateTime = this.pageData.updatedAt;
      } else {
        prevComment.user.notifications[this.id] = {
          type: this.type,
          dateTime: this.pageData.updatedAt,
          text: "Someone has replied to you on a news post!",
          slug: this.pageData.slug
        };
      }
      this.$axios('https://macvars.herokuapp.com/' + `users/${prevComment.user._id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: prevComment.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {});
    },
    sendAtMsgNotifMatches(match) {
      // Send notif to guy who got @d
      const prevComment = store.getters.getComment;
      if (prevComment.user.notifications[this.id]) {
        prevComment.user.notifications[
          this.id
        ].dateTime = this.pageData.updatedAt;
      } else {
        prevComment.user.notifications[this.id] = {
          type: this.type,
          dateTime: this.pageData.updatedAt,
          text: "Someone has replied to you on a match post!",
          slug: this.pageData.slug
        };
      }
      this.$axios('https://macvars.herokuapp.com/' + `users/${prevComment.user._id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: prevComment.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {});
    },
    sendAtMsgNotif(forum) {
      const prevComment = store.getters.getComment;
      // Send notif to guy who got @d
      if (prevComment.user.notifications[this.id]) {
        prevComment.user.notifications[
          this.id
        ].dateTime = this.pageData.updatedAt;
      } else {
        prevComment.user.notifications[this.id] = {
          type: this.type,
          dateTime: this.pageData.updatedAt,
          text: "Someone has replied to you on a forum post!",
          slug: this.pageData.slug
        };
      }
      this.$axios('https://macvars.herokuapp.com/' + `users/${prevComment.user._id}`, {
        method: "patch",
        headers: new Headers({
          "content-type": "application/json"
        }),
        data: prevComment.user
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {});
    },
    deleteComment(comment) {
      this.$buefy.dialog.confirm({
        message: "Are you sure you want to delete this comment?",
        type: "is-dark",
        onConfirm: () => {
          this.$axios('https://macvars.herokuapp.com/' + `api/comments/${comment._id}`, {
            method: "patch",
            headers: {
              "content-type": "application/json"
            },
            data: { isRemoved: true }
          })
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              window.location.reload();
            });
        }
      });
    },
    navUser(id) {
      this.$router.push({ path: `/user/${id}` });
    }
  },
  components: { VueMarkdown, VEmojiPicker }
};
</script>
<style scoped lang="scss">
.table thead {
  display: none;
}
.table td,
.table th {
  border-bottom: 1px solid #ff726f !important;
  border-width: 0 0 1px;
}
@media screen and (max-width: 640px) {
  .comment-mobile {
    text-align: left;
  }
  .word-mobile {
  }
  .icon-comment {
    margin-right: 10px;
  }
}
.admin {
  color: lightgreen;
}
.moderator {
  color: skyblue;
}
.input-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
