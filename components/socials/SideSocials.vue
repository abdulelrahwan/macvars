<template>
  <div class="hello">
    <div class="card" style="margin-top:5px;text-align:left">
      <div class="columns is-centered">
        <div class="column is-one-third" style="text-align:center">
          <a href="mailto:macvarsity@gmail.com">
            <b-icon icon="email"></b-icon>
          </a>
        </div>
        <div class="column is-one-third" style="text-align:center">
          <a href="https://discord.gg/fhdhjdhjfd">
            <b-icon icon="discord"></b-icon>
          </a>
        </div>
        <div class="column is-one-third" style="text-align:center">
          <a href="https://twitter.com/fhhhjdhjgd">
            <b-icon icon="twitter"></b-icon>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const moment = require("moment");
export default {
  name: "SideEvents",
  props: {
    type: String
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.type-button {
  width: 150px;
}
.subtitle {
  margin-bottom: 5px;
  font-size: 16px;
}
.button {
  margin-top: 20px;
  margin-bottom: 20px;
}
.forum-title {
  width: 63%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dark-bkg {
  background-color: #202836;
}
</style>
