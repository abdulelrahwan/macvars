<template>
  <div>
    <b-navbar
      transparent
      fixed-top
      style="text-align:left"
      :wrapper-class="$device.isMobile ?'':'menu-content'"
      v-if="!loading"
    >
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="../assets/logofinal.png" style="width:35px" />
        </b-navbar-item>
      </template>
      <template slot="start" style="color:white">
        <nuxt-link to="/forums" class="menu-section">
          <b-navbar-item dark class="is-dark" style="color:white">
            <b>Forums</b>
          </b-navbar-item>
        </nuxt-link>
        <nuxt-link to="/matches" class="menu-section">
          <b-navbar-item dark class="is-dark" style="color:white">
            <b>Matches</b>
          </b-navbar-item>
        </nuxt-link>
        <nuxt-link to="/about" class="menu-section">
          <b-navbar-item class="is-dark" style="color:white">
            <b>About</b>
          </b-navbar-item>
        </nuxt-link>
      </template>
      <template slot="end">
        <b-navbar-item tag="section">
          <section>
            <navBarSearch />
          </section>
        </b-navbar-item>
        <b-navbar-item tag="div">
          <div class="buttons" v-if="!user.username">
            <nuxt-link to="/signup" style="margin-right:0.5em;">
              <a class="button" style="background-color:#ff4653">
                <strong>Sign up</strong>
              </a>
            </nuxt-link>
            <nuxt-link to="/login">
              <a class="button" style="background-color:#8c67ef; border-color:#8c67ef">Log in</a>
            </nuxt-link>
          </div>
          <div
            class="buttons"
            v-if="user.username"
            style="cursor:pointer"
            @click="navUser(user.id)"
          >
            <p class="subtitle" style="margin-right:10px;margin-bottom:15px">
              User
              <span
                v-if="notifications && Object.keys(notifications).length!=0"
                style="margin-left:0px;font-size:15px;vertical-align: text-top;color:#ff726f;font-weight:bold"
              >{{Object.keys(notifications).length}}</span> |
              <span @click="logout()" style="cursor:pointer;color:#ff726f">Logout</span>
            </p>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>

    <section>
      <div>
        <div class="columns is-centered ordered-mobile">
          <div class="column is-narrow fl-3" style="margin-top:50px">
            <div :style="{width:!$device.isMobile?'200px':'' }">
              <SideEvents style="font-size:14px" />
            </div>
          </div>
          <div class="column is-narrow fl-1" :key="selectedType">
            <div :style="{width:!$device.isMobile?'800px':'' }">
              <nuxt />
            </div>
          </div>
          <div class="column is-narrow fl-2" style="margin-top:50px">
            <div :style="{width:!$device.isMobile?'200px':'' }">
              <div style="text-align:left" class="subtitle">Recent Activity</div>
              <div class="card" style="padding:0px">
                <div class="card-content" style="padding:0px">
                  <SideForums />
                </div>
                
              </div>

               <div class="card-content" style="padding:0px">
                  <SideMatches style="margin-top:-10px"/>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import navBarSearch from "./navBarSearch";
import SideForums from "../components/Forums/SideForums";
import SideEvents from "../components/Events/SideEvents";
import SideMatches from "../components/SideMatches/SideMatches"
export default {
  layout: "sides",
  created() {
    this.$nextTick(function() {
      this.loading = false;
    });
  },
  data() {
    return {
      items: [
        {
          title: "Home",
          icon: "home",
          to: { name: "index" }
        },
        {
          title: "Inspire",
          icon: "lightbulb",
          to: { name: "inspire" }
        }
      ],
      user: {
        email: "",
        password: "",
        username: undefined,
        id: ""
      },
      notifications: undefined,
      playerSearchData: [],
      playerSelected: null,
      fetchingPlayer: false,
      playerName: "",
      selected: null,
      loading: true
    };
  },
  methods: {
    logout() {
      if (process.browser) {
        localStorage.removeItem("auth");
      }
      window.location.reload();
    },
    navUser(id) {
      this.$router.push({ path: `/user/${id}` });
    },
    getPlayerSearchResults: debounce(function(name) {
      if (!name.length) {
        this.playerSearchData = [];
        // this.playerPage = 1
        // this.totalPlayerPages = 1
        return;
      }
      this.fetchingPlayer = true;
      this.$axios('https://macvars.herokuapp.com/' + `api/players?name[$search]=${name}`, {
        method: "get",
        headers: {
          "content-type": "application/json"
        }
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          this.playerSearchData = [];
          response.data.forEach(item => this.playerSearchData.push(item));
        })
        .catch(error => {
          this.playerSearchData = [];
          throw error;
        })
        .finally(() => {
          this.fetchingPlayer = false;
        });
    }, 500),
    getPlayerImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/players/${img}`;
    },
    navPlayer(player) {
      this.selected = player;
      if (player) {
        this.$router.push({ path: `/players/${player._id}` });
      }
    },
    onFocus(e) {
      e.stopPropagation();
    }
  },
  components: { navBarSearch, SideEvents, SideForums, SideMatches }
};
</script>
<style lang="scss">
@media screen and (min-width: 640px) {
  .menu-section {
    border-right: 1px solid #59667b;
  }
  .menu-section.first-section {
    border-left: 1px solid #59667b;
  }
  .menu-section:hover {
    background: #313c4f;
  }
  .menu-section:not(.beta) a {
    line-height: 2.2em;
  }
  .navbar-brand:hover {
    background: #313c4f;
  }
}

.menu-content {
  display: flex;
  width: 1300px;
  margin: auto;
}
@media screen and (max-width: 769px) {
  .ordered-mobile {
    display: flex;
    flex-flow: column;
  }
  .ordered-mobile .fl-1 {
    order: 1;
  }
  .ordered-mobile .fl-2 {
    order: 2;
  }
  .ordered-mobile .fl-3 {
    order: 3;
  }
}
</style>

