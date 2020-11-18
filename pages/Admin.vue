<template>
  <div class="hello" style="width:100%">
    <AdminComponent />
  </div>
</template>

<script>

import AdminComponent from "../components/Admin/AdminComponent";
export default {
  layout:"OnlyNav",
  name: "Admin",
  props: {
    type: String
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  components: { AdminComponent }
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
