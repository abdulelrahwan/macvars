<template>
  <div
    class="card"
    style="cursor:pointer;display:inline-block;width:280px"
    @click="navEventDetails(event._id, event.slug)"
    >
        <div class="card-content is-flex" :style="{'height': '150px', 'padding': 0, 'align-items': 'flex-end', 'background': `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 90%), url(${getEventImgUrl(event)}) no-repeat center center`, 'background-size': 'cover'}">
            <div style="position: absolute; top: 0.5em; right: 0.5em">
            <b-tag rounded style="background-color:green" v-if="getStatus(event) === 'live'">Live</b-tag>
            <b-tag rounded style="background-color:blue" v-if="getStatus(event) === 'coming'">Upcoming</b-tag>
            <b-tag rounded style="background-color:black" v-if="getStatus(event) === 'prev'">Finished</b-tag>
            </div>
            <div style="width: 100%">
            <p style="padding-bottom: 0.5em">{{event.name}}</p>
            </div>
        </div>
        <footer class="card-footer">
            <p class="card-footer-item" style="color:#ff726f">{{formatDateEvent(event.date.from)}}</p>
        </footer>
    </div>
</template>

<script>
const moment = require("moment");

export default {
    props: ['event'],
    methods: {
        getEventImgUrl(event) {
            return 'https://macvars.herokuapp.com/' + `api/uploads/events/${event.img}`;
        },
        formatDateEvent(dateTime) {
            const utc = moment.utc(dateTime);
            var localDate = utc.local();
            return moment(localDate).format("MMMM DD, YYYY");
        },
        getStatus(event) {
            if (
                moment(new Date()).isBetween(
                moment(event.date.from),
                moment(event.date.to)
                )
            ) {
                return 'live'
            } else if (
                moment(new Date()).diff(moment(event.date.to)) <= 0
            ) {
                return 'coming'
            } else {
                return 'prev'
            }
        },
        navEventDetails(id, slug) {
            this.$router.push({ path: `/events/${id}/${slug}` });
        },
    }
}
</script>

<style>

</style>