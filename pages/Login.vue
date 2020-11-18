<template>
  <div class="hello">
    <h1 style="font-size:50px;margin-bottom:20px">Login</h1>
    <div class="columns is-centered">
      <div class="column is-one-fifth">
        <div class="card">
          <div class="card-content">
            <div style="text-align:left">
              <b-field label="Email">
                <b-input placeholder="Email..." type="email" v-model="user.email"></b-input>
              </b-field>
              <b-field label="Password">
                <b-input placeholder="Password..." type="password" v-model="user.password"></b-input>
              </b-field>
            </div>
            <p
              @click="resend"
              style="cursor:pointer;color:#ff726f;margin-top:20px"
              v-if="verifyEmail"
            >Click to resend verification</p>
            <p
              @click="sendForgot"
              v-if="isDone"
              style="cursor:pointer;color:#ff726f;margin-top:20px"
            >Forgot Password?</p>
            <p
              @click="sendForgot"
              v-if="!isDone"
              style="cursor:pointer;color:white;margin-top:20px"
            >Forgot Password?</p>
          </div>
          <footer class="card-footer" style="height:60px;">
            <span class="card-footer-item">
              <b-button style="background-color:#ff726f" @click="login">Submit</b-button>
            </span>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
   layout:"OnlyNav",
  name: "Characters",
  props: {
    type: String
  },
  data() {
    return {
      user: {
        strategy: "local",
        email: "",
        password: ""
      },
      isDone: true,
      verifyEmail: false
    };
  },
  mounted() {},
  methods: {
    sendForgot() {
      if (this.user.email === "") {
        this.$buefy.snackbar.open("Please enter a valid email!");
      } else {
        this.isDone = false;
        const data = {
          action: "sendResetPwd",
          value: { email: this.user.email }
        };
        this.$axios('https://macvars.herokuapp.com/' + "authmanagement", {
          method: "post",
          headers: new Headers({ "content-type": "application/json" }),
          data: data
        })
          .then(function(response) {
            return response.data;
          })
          .then(response => {
            if (response.code !== undefined) {
              this.$buefy.snackbar.open(response.message);
            } else {
              this.$buefy.snackbar.open({
                message: `An email has been sent to ${this.user.email}. Please check your spam!`,
                duration: 15000
              });
            }
            this.isDone = true;
          })
          .catch(error => {
            if (error.response) {
              this.$buefy.snackbar.open({
                message: error.response.data.message,
                duration: 5000
              });
            }
          });
      }
    },
    login() {
      this.$axios('https://macvars.herokuapp.com/' + "api/authentication", {
        method: "post",
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
            if (false) {
              this.$buefy.snackbar.open("Please verify your email!");
              this.verifyEmail = true;
              return;
            }
            this.$buefy.snackbar.open("Login successful!");

            if (process.browser) {
              this.$aes.setKey("SECURE_VAL_PW");
              let encrypted = this.$aes.encrypt(JSON.stringify(response));
              // let decrypted = this.$aes.decrypt(encrypted);
              localStorage.setItem("auth", encrypted);
              this.$router.push({ path: `/` });
              this.$axios.setHeader(
                "Authorization",
                `Bearer ${response.accessToken}`
              );
              setTimeout(function() {
                window.location.reload();
              }, 1000);
            }
          }
        })
        .catch(err => {
          this.$buefy.snackbar.open("Invalid Credentials");
          return err;
        });
    },
    resend() {
      this.$axios('https://macvars.herokuapp.com/' + `users?email=${this.user.email}`, {
        method: "get",
        headers: new Headers({ "content-type": "application/json" })
      })
        .then(function(response) {
          return response.data;
        })
        .then(res => {
          const usr = res.data[0];
          this.$axios('https://macvars.herokuapp.com/' + "users/" + usr._id, {
            method: "patch",
            headers: {
              "content-type": "application/json",
              resendemail: true
            },
            data: usr
          })
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              this.$buefy.snackbar.open({
                message: "Please check email and spam for verification code!",
                duration: 15000
              });
              this.user = {
                strategy: "local",
                email: "",
                password: ""
              };
            });
        });
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
