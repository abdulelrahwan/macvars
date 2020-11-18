<template>
  <b-field>
      <b-autocomplete
        max-height="400px"
        v-model="typingData"
        style="width:230px;border-bottom-color:#171e29;border-bottom-height:1px"
        rounded
        icon="magnify"
        :data="searchData"
        placeholder="Search..."
        field="name"
        :loading="fetching"
        @typing="name=>getTeamSearchResults(name)"
        @select="option => selectTeam(option)"
        @click.native="onFocus"
      >
        <template slot-scope="props">
            <div style="width:100%;height:50px;">
                <img style="vertical-align:middle;width:40px" :src=" getTeamImgUrl(props.option.img)" />
                <span style="margin-left:80px;color:white">{{ props.option.name }}</span>
            </div>
        </template>
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
</template>

<script>
import debounce from "lodash/debounce";
export default {
    data() {
        return {
            searchData: [],
            fetching: false,
            typingData: ""
        }
    },
    methods: {
        getTeamSearchResults: debounce(function(name) {
            if (!name.length) {
                this.searchData = [];
                return;
            }
            this.fetchingPlayer = true;
            this.$axios('https://macvars.herokuapp.com/' + `api/teams?name[$search]=${name}`, {
                method: "get",
                    headers: {
                        "content-type": "application/json"
                    }
            })
                .then(function(response) {
                    return response.data;
                })
                .then(response => {
                    this.searchData = [];
                    response.data.forEach(item => this.searchData.push(item));
                })
                .catch(error => {
                    this.searchData = [];
                    throw error;
                })
                .finally(() => {
                    this.fetching = false;
                });
            }, 500),
        onFocus(e) {
            e.stopPropagation();
        },
        getTeamImgUrl(img) {
            return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${img}`;
        },
        selectTeam(option) {
            this.$emit('selected', option._id)
        }
    }
}
</script>

<style>

</style>