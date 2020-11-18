<template>
  <div class="hello">
    <div class="columns is-centered">
      <div class="column is-two-thirds">
        <div class="card" style="padding:50px;text-align:left">
          <div class="card-content">
            <p class="title">Events</p>
            <b-button @click="addEvent">Add Event</b-button>
            <b-table
              :paginated="true"
              :per-page="5"
              mobile-cards
              :data="events"
              :striped="true"
              :hoverable="true"
              @click="(row)=>editEvent(row)"
            >
              <template slot-scope="props">
                <b-table-column searchable label="Name" field="name">
                  <div style="text-align:left">{{props.row.name}}</div>
                </b-table-column>
                <b-table-column label="Groups" field="name">
                  <div v-for="(group, index) in props.row.groups" :key="index">
                    {{index+1}}
                    <span v-for="team in group" :key="team">
                      <p v-if="teamsObj[team]">{{teamsObj[team].name}}</p>
                    </span>
                    <br />
                  </div>
                </b-table-column>
                <b-table-column label="Advance in Group" field="name">
                  <div style="text-align:left"> {{props.row.NofTeamsAdvanceInGroup}}</div>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
    <b-modal  :active.sync="addEditEvents" has-modal-card trap-focus>
      <AddEditEvents style="overflow: scroll;max-height: 600px;" :mode="mode" :teams="teams" :passedEvent="event" :teamsObj="teamsObj"></AddEditEvents>
    </b-modal>
  </div>
</template>

<script>
import AddEditEvents from "./AddEditEvents";
export default {
  name: "AdminEvents",
  props: {
    events: { type: Array },
    teamsObj: { type: Object },
    teams: { type: Array }
  },
  data() {
    return {
      addEditEvents: false,
      showGroups: false,
      mode: "",
      event: {
        files: [],
        name: "",
        details: "",
        date: {
          from: "",
          to: ""
        },
        teamIds: [],
        teamsObj: {},
        img: "",
        matchIds: [],
        groups: [],
        active: true,
        activePlayerIds: [],
        NofTeamsAdvanceInGroup: 0,
        flag: "",
        location: "",
        numberOfTeams: 0
      }
    };
  },
  created() {
  },
  methods: {
    editEvent(event) {
      this.event = event;
      this.mode = "edit";
      this.addEditEvents = true;
    },
    addEvent() {
      this.mode = "add";
      this.addEditEvents = true;
    }
  },
  components: { AddEditEvents }
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
