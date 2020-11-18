<template style="height:100%">
  <div class="hello" style="height:100%">
    <h1 style="font-size:50px;margin-bottom:5px">Weapons</h1>
    <div class="columns is-centered">
      <section style="background-color:#273142" class="section dark">
        <article style="background-color:#273142" class="tile is-child box">
          <b-table style = "min-height:900px" :data="weaponsData" :dark=true :bordered=false :striped=true :hoverable=true>
            <template slot-scope="props">
              <b-table-column field="name" label="Name" searchable sortable>
                <img :src= "getImgUrl(props.row.name)" style="width:60px;height:25px; padding-right:5px"/>
                  {{props.row.name}}
              </b-table-column>
              <b-table-column field="type" label="Type" centered sortable>
                {{props.row.type}}
              </b-table-column>
              <b-table-column field="cost" label="Cost" centered numeric sortable>
                {{props.row.cost}}
              </b-table-column>
              <b-table-column field="fireMode" label="Fire Mode" centered sortable>
                {{props.row.fireMode}}
              </b-table-column>
              <b-table-column field="head" label="Head" centered numeric sortable>
                {{props.row.head}}
              </b-table-column>
              <b-table-column field="body" label="Body" centered numeric sortable>
                {{props.row.body}}
              </b-table-column>
              <b-table-column field="leg" label="Leg" centered numeric sortable>
                {{props.row.leg}}
              </b-table-column>
              <b-table-column field="range" label="Range" centered sortable>
                {{props.row.range}}
              </b-table-column>
              <b-table-column field="magSize" label="Mag Size" centered numeric sortable>
                {{props.row.magSize}}
              </b-table-column>
              <b-table-column field="fireRate" label="Fire Rate" centered sortable>
                {{props.row.fireRate}}
              </b-table-column>
              <b-table-column field="penetration" label="Penetration" centered sortable>
                <span v-if="props.row.penetration == 'High'" class="tag is-success">
                {{props.row.penetration}}
                </span>
                <span v-if="props.row.penetration == 'Medium'" class="tag is-warning">
                {{props.row.penetration}}
                </span>
                <span v-if="props.row.penetration == 'Low'" class="tag is-danger">
                {{props.row.penetration}}
                </span>
              </b-table-column>
            </template>
          </b-table>
        </article>
      </section>
    </div>
  </div>
</template>

<script>
import json from "./Weapons.JSON";
export default {
  name: "Weapons",
  props: {
    type: String
  },
  data() {
    return {
      weaponsData: json
    };
  },
  mounted() {
  },
  methods: {
    getImgUrl(weapon) {
      return require("../../assets/weapons/" + weapon + ".png");
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
table.table tr.table-foobar td {
  background-color: yellow ;
}
</style>
