<template>
  <div class="hello">
    <h1 style="font-size:50px;margin-bottom:20px">Thanks for verifying Please login!</h1>
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
        email: "",
        password: "",
        username: "",
        flag: "",
        notifications: { placeholder: true }
      }
    };
  },
  mounted() {
    var url = new URL(window.location.href);
    var token = url.searchParams.get("token");
    var obj = {
      action: "verifySignupLong",
      value: token
    };
    this.$axios('https://macvars.herokuapp.com/' + "authmanagement", {
      method: "post",
      headers: new Headers({ "content-type": "application/json" }),
      data: obj
    })
      .then(function(response) {
        return response.data;
      })
      .then(response => {
        if (response.code !== undefined) {
          this.$buefy.snackbar.open(response.message);
        } else {
        }
      })
      .catch(error => {
        if (error.response) {
          this.$buefy.snackbar.open({
            message: error.response.message,
            duration: 5000
          });
        }
      });
  },
  methods: {
    signup() {
      if (this.user.password.length < 5) {
        this.$buefy.snackbar.open({
          message: "Password has to be atleast 5 characters long!",
          duration: 5000
        });
      } else if (this.user.flag === "") {
        this.$buefy.snackbar.open({
          message: "Please choose a flag!",
          duration: 5000
        });
      } else {
        this.$axios('https://macvars.herokuapp.com/' + "users", {
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
              this.$buefy.snackbar.open({
                message: "Please check email and spam for verification code!",
                duration: 15000
              });
              this.$router.push({ path: `/login` });
            }
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
