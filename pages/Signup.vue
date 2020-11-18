<template>
  <div class="hello">
    <h1 style="font-size:50px;margin-bottom:20px">Signup</h1>
    <div class="columns is-centered">
      <div class="column is-one-fifth">
        <div class="card">
          <div class="card-content">
            <div style="text-align:left">
              <b-field label="Email">
                <b-input placeholder="Email..." type="email" v-model="user.email"></b-input>
              </b-field>
              <b-field label="Username">
                <b-input placeholder="Username..." v-model="user.username" maxlength=50></b-input>
              </b-field>
              <b-field label="Password">
                <b-input placeholder="Password..." type="password" v-model="user.password"></b-input>
              </b-field>
              <b-field label="Flag">
                <b-select v-model="user.flag" expanded placeholder="Select Flag">
                  <option
                    v-for="option in flagOptions"
                    :value="option.value"
                    :key="option.value"
                  >{{ option.text }}</option>
                </b-select>
              </b-field>
            </div>
          </div>
          <footer class="card-footer" style="height:60px;">
            <span class="card-footer-item">
              <b-button style="background-color:#ff726f" @click="signup">Submit</b-button>
            </span>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import flagOptions from "../assets/flags/flags.json";
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
      },
      flagOptions: flagOptions
    };
  },
  mounted() {},
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
              // this.$buefy.snackbar.open({
              //   message: "Please check email and spam for verification code!",
              //   duration: 15000
              // });
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
