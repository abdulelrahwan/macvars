<template>
  <div class="hello">
    <h1 style="font-size:50px;margin-bottom:20px">About</h1>
    <div class="columns is-centered">
      <div class="column is-narrow">
        <div :style="{width:!$device.isMobile?'800px':'' }">
          <div class="card">
            <div class="card-content">
              <p class="title">Who We Are</p>
              <div style="text-align:left">
                <p
                  class="subtitle"
                  style="font-size:17px"
                >MacVarsity	aims	to	provide	McMaster	students	with	up-to	date	varsity	sports	coverage.	The	
users	will	be	able	to	track	teams'/player	performance,	follow	their	favorite	tournaments,	and	
read	the	latest	news	about	the	teams	and	players.	The	app	will	also	feature	a	forum	section	for	
the	students	to	interact	with	one	another	and	discuss	anything	McMaster	varsity	related</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Characters",
  props: {
    type: String
  },
  data() {
    return {};
  },
  mounted() {},
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
