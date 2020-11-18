<template>
  <div class="main">
    <div class="columns is-centered" v-if="!$device.isMobile">
      <div class="column is-narrow" style="width:1300px;padding-top: 17px;padding-bottom: 0">
        <div class="container" style="display:flex">
          <h1
            style="font-family: Azonix; font-size:27px; color:#FF4654;margin-left:10px;margin-top:5px"
          >MacVarsity</h1>
        </div>
        <div v-if="$device.isMobile" class="vm-placement" data-id="5ed90390a624ae2e71257f75"></div>
      </div>
    </div>
    <div class="columns is-centered ordered-mobile">
      <div class="column is-narrow fl-1">
        <div :style="{width:!$device.isMobile?'800px':'' }">
          <!-- <div class="vm-placement" data-id="5ed90370b519801b8a4d528b"></div> -->
          <div v-if="!$device.isMobile" style="text-align:left" class="subtitle">Latest Articles</div>
          <div v-else style="text-align:left; margin-top:15px" class="subtitle">Latest Articles</div>
          <div
            class="card"
            v-for="singleNews in news.slice(0,1)"
            :key="singleNews.id"
            style="cursor:pointer;margin-top:20px"
          >
            <nuxt-link :to="`/news/${singleNews._id}/${singleNews.slug}`">
              <div
                class="card-content is-flex"
                :style="{'height': '300px', 'padding': 0, 'align-items': 'flex-end', 'background': `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 80%), url('${singleNews.img}') no-repeat center center`, 'background-size': 'cover'}"
              >
                <div style="width: 100%">
                  <p
                    style="padding-bottom: 0.5em;font-size:20px"
                    class="subtitle"
                  >{{singleNews.title}}</p>
                </div>
              </div>
            </nuxt-link>
          </div>
          <div
            v-for="(article,index) in news.slice(1,news.length)"
            :key="article._id"
            style="margin-top:10px"
          >
            <nuxt-link :to="`/news/${article._id}/${article.slug}`" style="padding:0px">
              <div
                class="card"
                style="margin-bottom:10px;cursor:pointer"
                v-bind:class="getBkg(index%2===0)"
                v-on:click="navNews(article._id, article.slug)"
              >
                <div class="card-content" style="padding-top: 0.5rem; padding-bottom: 0.5rem;">
                  <div class="columns is-centered is-vcentered is-mobile">
                    <div class="column is-1">
                      <div v-if="$device.isMobile">
                        <CountryFlag
                          v-bind:country="article.flag"
                          size="small"
                          style="vertical-align:-13.5px; margin-left:-20px; margin-right:-15px"
                          :key="article.flag"
                        />
                      </div>
                      <div v-if="!$device.isMobile">
                        <img
                          :src="article.img"
                          style="width:20px; height:20px;
                          vertical-align:-13.5px; margin-left:-20px; margin-right:-15px"
                        />
                      </div>
                    </div>
                    <div
                      class="column is-8"
                      style="text-align:left;vertical-align:middle"
                    >{{article.title}}</div>
                    <div class="column is-3" style="text-align:right">
                      <p style="display:inline-block; color:#ff4653">{{article.numComments}}</p>
                      <p style="display:inline-block; opacity:0.6">comments</p>
                      <p style="opacity:0.6">{{formatDate(article.date)}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import CountryFlag from "vue-country-flag";
const moment = require("moment");
import axios from "axios";
export default {
  name: "Characters",
  props: {
    type: String
  },
  asyncData() {
    return axios
      .all([
        axios.get('https://macvars.herokuapp.com/' + "api/news?$sort[date]=-1&$limit=12"),
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/matches?$sort[dateTime]=1&$limit=10&$skip=0&active=true&teamsDecided=true&populatemapsonly=true`,
          { headers: { "content-type": "application/json" } }
        ),
        axios.get(
          'https://macvars.herokuapp.com/' +
            `api/matches?$sort[dateTime]=-1&$limit=5&$skip=0&active=false&teamsDecided=true&populatemapsonly=true`,
          { headers: { "content-type": "application/json" } }
        )
      ])
      .then(
        axios.spread((news, matches, activeMatches) => {
          let oldMatches = [];
          let liveMatches = [];
          let matchData = matches.data.data;
          for (let i = 0; i < matchData.length; i++) {
            if (moment(new Date()).diff(moment(matchData[i].dateTime)) <= 0) {
              oldMatches.push(matchData[i]);
            } else {
              liveMatches.push(matchData[i]);
            }
          }
          return {
            news: news.data.data,
            matches: [...oldMatches],
            liveMatches: [...liveMatches],
            finishedMatches: [...activeMatches.data.data]
          };
        })
      )
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    navEventDetails(id) {
      this.$router.push({ path: `/events/${id}` });
    },
    navMatch(id, slug) {
      this.$router.push({ path: `/matches/${id}/${slug}` });
    },
    navNews(id, slug) {
      this.$router.push({ path: `/news/${id}/${slug}` });
    },
    getImgUrl(img) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/news/${img}`;
    },
    getDay(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MMM DD");
    },
    navNews(id, slug) {
      this.$router.push({ path: `/news/${id}/${slug}` });
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      if (this.$device.isMobile) {
        return moment(localDate).format("MMMM DD");
      } else {
        return moment(localDate).format("MMMM DD, YYYY");
      }
    },
    getBkg(type) {
      if (type) {
        return "light-bkg";
      } else {
        return "dark-bkg";
      }
    },
    getTeamImgUrl(teamId) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${teamId}`;
    },
    getLastMapScore(maps) {
      let details = {};
      for (let i = 0; i < maps.length; i++) {
        if (
          parseInt(maps[i].teamOneScore) !== 13 &&
          parseInt(maps[i].teamTwoScore) !== 13
        ) {
          return {
            teamOneScore: maps[i].teamOneScore,
            teamTwoScore: maps[i].teamTwoScore
          };
        }
      }
      return {
        teamOneScore: 0,
        teamTwoScore: 0
      };
    },
    getWinnerDetails(match) {
      let maps = match.maps;
      const details = {};
      if (maps.length === 1) {
        details.teamOneScore = maps[0].teamOneScore;
        details.teamTwoScore = maps[0].teamTwoScore;
        if (parseInt(details.teamOneScore) > parseInt(details.teamTwoScore)) {
          details.winner = 0;
        } else if (
          parseInt(details.teamOneScore) < parseInt(details.teamTwoScore)
        ) {
          details.winner = 1;
        }
      } else {
        let oneCount = 0;
        let twoCount = 0;
        for (let i = 0; i < maps.length; i++) {
          if (
            parseInt(maps[i].teamOneScore) > parseInt(maps[i].teamTwoScore) &&
            parseInt(maps[i].teamOneScore) === 13
          ) {
            oneCount += 1;
          } else if (
            parseInt(maps[i].teamOneScore) < parseInt(maps[i].teamTwoScore) &&
            parseInt(maps[i].teamTwoScore) === 13
          ) {
            twoCount += 1;
          }
        }
        details.teamOneScore = oneCount;
        details.teamTwoScore = twoCount;
        if (match && match.defaultWin) {
          details.teamOneScore += match.defaultWin.teamOneScore;
          details.teamTwoScore += match.defaultWin.teamTwoScore;
        }
        if (oneCount > twoCount) {
          details.winner = 0;
        } else if (oneCount < twoCount) {
          details.winner = 1;
        }
      }
      return details;
    },
    getOutcomeClass(winner) {
      if (!winner) {
        return "loser";
      } else {
        return "winner";
      }
    },
    getOutcomeClassLive(winner) {
      if (!winner) {
        return "loser-live";
      } else {
        return "winner-live";
      }
    },
    getMapClass(scoreOne, scoreTwo) {
      if (scoreOne > scoreTwo) {
        return "regular";
      } else if (scoreTwo > scoreOne) {
        return "regular";
      } else {
        return "regular";
      }
    },
    formatDateEvent(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MMMM DD, YYYY");
    }
  },
  components: { VueMarkdown, CountryFlag }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@font-face {
  font-family: Azonix;
  src: url("../assets/fonts/Azonix.otf");
}
.type-button {
  width: 150px;
}
.button {
  margin-top: 20px;
  margin-bottom: 20px;
}
.char-card {
  cursor: pointer;
  padding: 10px;
}
.box {
  width: 220px;
  height: 266px;
}
@media screen and (max-width: 640px) {
  .main {
    height: 100%;
  }
  .hide-img {
    display: none;
  }
}
@media screen and (min-width: 640px) {
  .main {
    height: 100vh;
  }
}
.subtitle {
  margin-bottom: 5px;
  font-size: 16px;
}
.winner {
}
.loser {
  opacity: 0.4;
}
.winner-live {
  color: lightgreen;
}
.loser-live {
  color: orangered;
}
.regular {
  color: white;
}
@media screen and (min-width: 640px) {
  .main {
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
}
@media screen and (max-width: 640px) {
  .main {
    justify-content: center;
    align-items: center;
    height: 100%;
  }
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
