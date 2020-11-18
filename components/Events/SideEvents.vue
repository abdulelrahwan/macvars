<template>
  <div class="hello">
    <div style="text-align:left;" class="subtitle" v-if="liveEvents.length>0">Live Events</div>
    <div
      class="card"
      v-for="(event) in liveEvents"
      :key="event.id"
      style="margin-top:5px;text-align:left"
      v-bind:class="getBkg(index%2===0)"
    >
      <nuxt-link :to="`/events/${event._id}/${event.slug}`">
        <div
          class="card-content"
          style="padding-top: 0.5rem; padding-bottom: 0.5rem;padding-left: 0"
        >
          <img :src="event.img" style="width:15px; height:15px"/>
          <country-flag v-bind:country="event.flag" size="medium" />
          <p
            class="subtitle forum-title"
            style="text-align:left;font-size:14px;display:inline-block; margin-bottom:10px"
          >{{event.name}}</p>
        </div>
      </nuxt-link>
    </div>
    <div
      style="text-align:left;margin-top:20px"
      class="subtitle"
      v-if="events.length>0"
    >Upcoming Events</div>
    <div
      class="card"
      v-for="(event, index) in events"
      :key="event.id"
      style="margin-top:5px;text-align:left"
      v-bind:class="getBkg(index%2===0)"
    >
      <nuxt-link :to="`/events/${event._id}/${event.slug}`">
        <div
          class="card-content"
          style="padding-top: 0.5rem; padding-bottom: 0.5rem;padding-left: 0"
        >
          <country-flag v-bind:country="event.flag" size="medium" />
          <p
            class="subtitle forum-title"
            style="text-align:left;font-size:14px;display:inline-block; margin-bottom:10px"
          >{{event.name}}</p>
        </div>
      </nuxt-link>
    </div>
    <div
      style="text-align:left;margin-top:20px"
      class="subtitle"
      v-if="pastEvents.length>0"
    >Sports</div>
    <div
      class="card"
      v-bind:class="getBkg(index%2===0)"
      v-for="(event, index) in pastEvents"
      :key="event.id"
      style="text-align:left;margin-top:5px"
    >
      <nuxt-link :to="`/events/${event._id}/${event.slug}`">
        <div
          class="card-content"
          style="padding-left: 10px; margin-bottom:0px; padding-bottom:10px"
        >
          <img :src="getImgUrl(event.img)" style="width:20px; height:20px; margin-bottom:5px; padding-top:0px; padding-bottom:0px"/>
          <p
            class="subtitle forum-title"
            style="text-align:left;font-size:14px;display:inline-block;"
          >{{event.name}}</p>
        </div>
      </nuxt-link>
    </div>
    <div style="text-align:left;margin-top:20px" class="subtitle">Connect with us!</div>
    <SideSocials style="font-size:14px;margin-top:20px" />
  </div>
</template>

<script>
const moment = require("moment");
import SideSocials from "../../components/socials/SideSocials";
export default {
  name: "SideEvents",
  props: {
    type: String
  },
  data() {
    return {
      events: [],
      pastEvents: [],
      liveEvents: []
    };
  },
  created() {
    this.$axios(
      'https://macvars.herokuapp.com/' + "api/events?$sort[createdAt]=-1&$limit=5",
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
          this.$buefy.snackbar.open(response.message);
        } else {
          for (let i = 0; response.data.length; i++) {
            if (
              moment(new Date()).isBetween(
                moment(response.data[i].date.from),
                moment(response.data[i].date.to)
              )
            ) {
              this.liveEvents.push(response.data[i]);
            } else if (
              moment(new Date()).diff(moment(response.data[i].date.to)) <= 0
            ) {
              this.events.push(response.data[i]);
            } else {
              this.pastEvents.push(response.data[i]);
            }
          }
        }
      });
  },
  methods: {
    formatDateEvent(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MMMM DD, YYYY");
    },
    getImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/events/${img}`;
    },
    navEventDetails(id, slug) {
      this.$router.push({ path: `/events/${id}/${slug}` });
    },
    formatDetails(details) {
      if (details.length > 250) {
        return details.slice(0, 250) + "...";
      }
      return details;
    },
    getBkg(type) {
      if (type) {
        return "light-bkg";
      } else {
        return "dark-bkg";
      }
    }
  },
  components: { SideSocials }
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
