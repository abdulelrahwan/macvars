<template>
  <b-table :data="tableDataSimple" headerClass="color: white" :row-class="row => row.result === 'Victory' && 'is-victory'">
    <template slot-scope="props">
      <b-table-column width="40" label="Type" header-class="white-header">{{ props.row.type }}</b-table-column>
      <b-table-column label="Agent" centered header-class="white-header">
        <figure class="image is-64x64" style="margin: auto">
          <img :src="getImgUrl(props.row.character.toLowerCase())" alt="Image" class="characterImg" />
        </figure>
        <!-- <p class="title is-5" style="padding-top: 1em">{{ props.row.character }}</p> -->
      </b-table-column>
      <b-table-column label="KDA" header-class="white-header" width="100px" centered>
        {{ props.row.KDA }}
        <span class="tag is-primary" v-if="props.row.isMvp">MVP</span>
      </b-table-column>
      <b-table-column centered label="Date" header-class="white-header">{{ new Date(props.row.date).toLocaleDateString() }}</b-table-column>
      <b-table-column label="Result" centered header-class="white-header">
        <p class="title is-6" style="margin: 0">{{ props.row.result }}</p>
        <p style="margin: 0">{{ props.row.score }}</p>
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
export default {
  methods: {
    getImgUrl(character) {
      if (character === "sova") {
        return require("@/assets/characters/" + character + ".webp");
      }
      return require("@/assets/characters/" + character + ".png");
    }
  },
  data() {
    const tableDataSimple = [
      {
        type: "Ranked",
        character: "Sova",
        KDA: "14/0/4",
        date: "2016/10/15 13:43:27",
        result: "Victory",
        isMvp: false,
        score: "13 : 11"
      },
      {
        type: "Ranked",
        character: "Raze",
        KDA: "15/10/2",
        date: "2016/12/15 06:00:53",
        result: "Victory",
        isMvp: false,
        score: "13 : 4"
      },
      {
        type: "Ranked",
        character: "Jett",
        KDA: "10/3/5",
        date: "2016/04/26 06:26:28",
        result: "Defeat",
        isMvp: false,
        score: "9 : 13"
      },
      {
        type: "Ranked",
        character: "Viper",
        KDA: "22/1/2",
        date: "2016/04/10 10:28:46",
        result: "Victory",
        isMvp: true,
        score: "13 : 12"
      },
      {
        type: "Ranked",
        character: "Omen",
        KDA: "5/4/15",
        date: "2016/12/06 14:38:38",
        result: "Victory",
        isMvp: false,
        score: "13 : 1"
      }
    ];

    return {
      tableDataSimple,
      isCustom: false
    };
  }
};
</script>

<style scoped>
.characterImg {
  object-fit: contain;
  -o-object-fit: contain;
  height: 64px;
}

td {
  vertical-align: middle !important;
}
</style>