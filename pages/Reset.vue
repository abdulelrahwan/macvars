<template>
  <div class="hello">
    <h1 style="font-size:50px;margin-bottom:20px">Change Password</h1>
    <div class="columns is-centered">
      <div class="column is-one-fifth">
        <div class="card">
          <div class="card-content">
            <div style="text-align:left">
              <b-field label="Password">
                <b-input placeholder="Password..." type="password" v-model="value.password"></b-input>
              </b-field>
            </div>
          </div>
          <footer class="card-footer" style="height:60px;">
            <span class="card-footer-item">
              <b-button style="background-color:#ff726f" @click="reset">Submit</b-button>
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
      value: {
        token: "",
        password: ""
      }
    };
  },
  mounted() {},
  methods: {
    reset() {
      if (this.value.password.length < 5) {
        this.$buefy.snackbar.open({
          message: "Password has to be atleast 5 characters long!",
          duration: 5000
        });
      } else {
        this.value.token = window.location.search.split("?token=")[1];
        const data = {
          action: "resetPwdLong",
          value: this.value
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
                message: "Password has been reset!",
                duration: 15000
              });
              router.push({ path: `/login` });
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
