<template>
  <div class="hello" v-if="match" :key="counter">
    <div class="columns is-centered" style="margin-top:20px">
      
      <div class="column is-narrow">
        <div class="column is-narrow" style="padding:0px">
          <div :style="{width:!$device.isMobile?'800px':'' }">
            <div class="card" style="width:800px">
              <div class="card-content">
                <div class="columns is-mobile">
                  <div class="column is-one-third">
                    <nuxt-link :to="`/teams/${match.teamOne._id}`">
                      <div style="width:60px;height:60px;overflow: hidden;display:inline-block">
                        <img
                          :src="getImgUrl(match.teamOne.img)"
                          style="border-radius: 50%;clear:both;"
                        />
                      </div>
                      <h1
                        class="subtitle"
                        style="font-weight:bold;font-size:18px"
                      >{{match.teamOne.name}}</h1>
                      <div>
                        <p
                          class="subtitle"
                          style="font-weight:bold; font-size:23px"
                          v-bind:class="getOutcomeClass(getWinnerDetails(match.maps).winner === 0)"
                        >{{getWinnerDetails(match.maps).teamOneScore}}</p>
                      </div>
                    </nuxt-link>
                    <span></span>
                  </div>
                  <div class="column is-one-third" style="margin-top:30px">
                    <p style="font-size:14px">{{formatDate(match.dateTime)}}</p>
                    <div style="opacity:50%" v-if="matchEvent">
                      <nuxt-link
                        :to="`/events/${matchEvent._id}/${matchEvent.slug}`"
                        style="padding:0px;color:white"
                      >{{matchEvent.name}}</nuxt-link>
                    </div>
                    <!-- <p style="margin-top:20px" v-if="match.maps.length > 1">Best of 3</p>
                    <p style="margin-top:20px" v-if="match.maps.length == 1">Best of 1</p> -->
                    <p v-if="match.type">{{match.type}}</p>
                  </div>
                  <div class="column is-one-third">
                    <div>
                      <span>
                        <nuxt-link :to="`/teams/${match.teamTwo._id}`">
                          <div style="width:60px;height:60px;overflow: hidden;display:inline-block">
                            <img
                              :src="getImgUrl(match.teamTwo.img)"
                              style="border-radius: 50%;clear:both;"
                            />
                          </div>
                          <h1
                            class="subtitle"
                            style="font-weight:bold;font-size:18px"
                          >{{match.teamTwo.name}}</h1>
                          <div>
                            <p
                              class="subtitle"
                              style="font-weight:bold;font-size:23px"
                              v-bind:class="getOutcomeClass(getWinnerDetails(match.maps).winner === 1)"
                            >{{getWinnerDetails(match.maps).teamTwoScore}}</p>
                          </div>
                        </nuxt-link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered" style="margin-top:10px">
          <div class="column is-narrow">
            <div :style="{width:!$device.isMobile?'800px':'400px'}">
              <div class="columns is-centered">
                <div
                  class="column is-half-desktop is-full-mobile"
                  :style="{width:$device.isMobile?'430px':'' }"
                >
                  <div
                    style="padding:0px;background-color:#222c3c;margin-bottom:10px"
                    v-if="match.defaultWin"
                  >
                    <div class="container-img" style="margin-left:0px;">
                      <div
                        style="width:100%;height:30px;overflow: hidden;display:inline-block;text-align:left;background-color:#191919"
                      ></div>
                      <div class="centered">Default</div>
                    </div>
                  </div>
                  <div
                    style="text-align:center;padding:0px;background-color:#222c3c"
                    v-for="(map, index) in match.maps"
                    :style="{'margin-top':index!=0?'10px':''}"
                    :key="index"
                  >
                    <div style="padding:0px">
                      <div class="container-img" style="margin-left:0px;">
                        <div
                          style="width:100%;height:25px;overflow: hidden;display:inline-block;text-align:left"
                        >
                          <img
                            v-if="map.tba === undefined || map.tba === false"
                            :src="getMapImg(map.map.img)"
                            style="opacity:40%;"
                          />
                          <img
                            v-if="map.tba !== undefined && map.tba === true"
                            :src="getMapImg('TBA.png')"
                            style="opacity:40%;"
                          />
                        </div>
                        <div
                          v-if="map.tba === undefined || map.tba === false"
                          class="centered"
                        >{{map.map.name}}</div>
                        <div v-if="map.tba !== undefined && map.tba === true" class="centered">TBA</div>
                      </div>
                      <div style="font-weight:bold;">
                        <p
                          v-bind:class="getLiveOutcomeClass(map.teamOneScore, map.teamTwoScore)"
                          style="font-size:15px;display:inline-block"
                        >{{map.teamOneScore}}</p>
                        <span style="margin-left:3px;margin-right:3px">-</span>
                        <p
                          style="font-size:15px;display:inline-block"
                          v-bind:class="getLiveOutcomeClass(map.teamTwoScore, map.teamOneScore)"
                        >{{map.teamTwoScore}}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="column is-half-desktop is-full-mobile"
                  :style="{width:$device.isMobile?'430px':'' }"
                >
                  <b-menu style="background-color:#222c3c">
                    <b-menu-list
                      style="text-align:center"
                      v-for="(stream, index) in match.streams"
                      :key="index"
                    >
                      <div>
                        <b-menu-item
                          @click="streamIndex = index"
                          style="text-align:center;overflow:hidden;text-overflow: ellipsis;border-bottom-color:#171e29;border-bottom-height:1px;border-bottom-style:solid"
                        >
                          <template slot="label">
                            <p style="cursor:pointer;text-align:left">
                              <span style="color:#ff726f;display:inline-block">
                                <i href="https://www.youtube.com/watch?v=UcLio5W3osY" class="fab fa-youtube" style="color:#ff726f;"></i>
                              </span>
                              <span style="display:inline-block; margin-left:20px">{{stream}}</span>
                            </p>
                          </template>
                        </b-menu-item>
                      </div>
                    </b-menu-list>
                  </b-menu>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered" v-if="showTwitch">
          <div class="column is-narrow" :key="streamIndex">
            <div class="card" style="width:800px">
              <div class="card-content">
                <iframe
                  :src="getStream()"
                  style="height:400px"
                  width="100%"
                  frameborder="5"
                  scrolling="no"
                  allowfullscreen="true"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <div
          class="columns is-centered"
          v-if="match.maps[0].playerStatIds.length != 0"
          style="margin-top:-20px"
        >
          <div class="column is-narrow" style="text-align:left">
            <b-button
              v-if="match.maps.length>1"
              :style="{'color':viewMap === -1?'white':'','border-color':viewMap === -1?'#ff4653':'#222c3c','font-weight':viewMap === -1?'bold':''}"
              style="background-color:#222c3c;margin-right:0px;width:70px;padding:0px;border-radius:0px"
              @click="setMap(-1);viewMap=-1"
            >All</b-button>
            <span v-for="(map, index) in match.maps" :key="map._id" style="padding:0px">
              <span style="margin-left:-1px">
                <b-button
                  v-if="map.tba === undefined || map.tba === false"
                  style="background-color:#222c3c;margin-right:2px;width:70px;border-radius:0px"
                  :style="{'color':viewMap === index?'white':'','border-color':viewMap === index?'#ff4653':'#222c3c','font-weight':viewMap === index?'bold':''}"
                  @click="setMap(index);viewMap=index;"
                >{{map.map.name}}</b-button>
                <b-button
                  v-else
                  style="background-color:#222c3c;margin-right:2px;width:70px;border-radius:0px"
                  :style="{'color':viewMap === index?'white':'','border-color':viewMap === index?'#ff4653':'#222c3c','font-weight':viewMap === index?'bold':''}"
                  @click="setMap(index);viewMap=index;"
                >TBA</b-button>
              </span>
            </span>
            <div class="card" style="width:800px;margin-top:-20px">
              <div class="card-content">
                <div>
                  <p
                    class="subtitle"
                    style="font-weight:bold;margin-left:10px;margin-bottom:0.5rem"
                  >{{match.teamOne.name}}</p>
                  <b-table
                    :data="filterTeamPlayers(map.playerStats,1)"
                    :bordered="false"
                    :striped="true"
                    :hoverable="true"
                    :key="viewMap"
                    :mobile-cards="false"
                    default-sort="rating"
                    default-sort-direction="desc"
                    style="font-size:14px;cursor:pointer"
                    @click="navPlayer"
                  >
                    <template slot-scope="props">
                      <b-table-column
                        field="PlayerId"
                        label="Player"
                        v-if="players[props.row.playerId]"
                      >{{players[props.row["playerId"]].name}}                      
                      </b-table-column>
                      <b-table-column
                        field="avgCombatScore"
                        label="Points"
                        sortable
                      >{{props.row["avgCombatScore"]}}</b-table-column>
                      <b-table-column
                        field="Assists"
                        label="Assists"
                        sortable
                      >{{props.row["kills"]}}</b-table-column>
                      <b-table-column
                        field="Rebounds"
                        label="Rebounds"
                        sortable
                      >{{props.row["deaths"]}}</b-table-column>
                      <b-table-column
                        field="firstBloods"
                        label="Steals"
                        sortable
                      >{{props.row["assists"]}}</b-table-column>
                      <b-table-column
                        field="defuses"
                        label="Blocks"
                        sortable
                      >{{props.row["econRating"]}}</b-table-column>
                      <b-table-column field="Fouls" label="Fouls" sortable>{{props.row["firstBloods"]}}</b-table-column>
                    </template>
                  </b-table>
                </div>
                <div>
                  <p
                    class="subtitle"
                    style="font-weight:bold;margin-left:10px;margin-bottom:0.5rem;margin-top:30px"
                  >{{match.teamTwo.name}}</p>
                  <b-table
                    :data="filterTeamPlayers(map.playerStats,2)"
                    :bordered="false"
                    :striped="true"
                    :hoverable="true"
                    :key="viewMap"
                    :mobile-cards="false"
                    style="font-size:14px;cursor:pointer"
                    default-sort="rating"
                    default-sort-direction="desc"
                    @click="navPlayer"
                  >
                    <template slot-scope="props">
                      <b-table-column
                        field="PlayerId"
                        label="Player"
                        v-if="players[props.row.playerId]"
                      >{{players[props.row["playerId"]].name}}  
                      </b-table-column>
                      <b-table-column
                        field="avgCombatScore"
                        label="Points"
                        sortable
                      >{{props.row["avgCombatScore"]}}</b-table-column>
                      <b-table-column
                        field="kills"
                        label="Assists"
                        sortable
                      >{{props.row["kills"]}}</b-table-column>
                      <b-table-column
                        field="econRating"
                        label="Rebounds"
                        sortable
                      >{{props.row["econRating"]}}</b-table-column>
                      <b-table-column
                        field="firstBloods"
                        label="Steals"
                        sortable
                      >{{props.row["assists"]}}</b-table-column>
                      <b-table-column field="Blocks" label="Blocks" sortable>{{props.row["econRating"]}}</b-table-column>
                      <b-table-column
                        field="defuses"
                        label="Fouls"
                        sortable
                      >{{props.row["firstBloods"]}}</b-table-column>
                    </template>
                  </b-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-narrow" style="text-align:right">
            <div
              class="subtitle"
              style="text-align: left;margin-bottom: 0.5rem;"
              :style="{width:!$device.isMobile?'800px':'400px'}"
            ></div>
            <div style="text-align:left;float:left" class="subtitle">Lineups</div>
            <div style="margin-bottom:1rem">
              <div
                :style="{'margin-bottom':!$device.isMobile?'1.5rem':'0.5rem','padding-bottom':!$device.isMobile?'':'10px','background':'#1c2431'}"
              >
                <div
                  class="subtitle"
                  style="display:flex;justify-content:center;padding-top:10px;margin-bottom:20px"
                >
                  <img :src="getImgUrl(match.teamOne.img)" style="height:1.3em" />
                  &nbsp {{match.teamOne.name}}
                </div>
                <div
                  v-if="match.teamOne.activePlayerIds.length==0"
                  :style="{'margin-bottom':!$device.isMobile?'':'-40px'}"
                >
                  <div
                    :style="{width:!$device.isMobile?'140px':'70px','padding-bottom':'10px','font-size':'13px','margin-left':'41%','margin-bottom':'30px'}"
                  >
                    <div
                      class="card"
                      @click="navPlayerPage(player._id)"
                      :style="{height:!$device.isMobile?'175px':'105px','cursor':'pointer'}"
                    >
                      <div
                        :style="{height:!$device.isMobile?'140px':'70px','width':'100%','display':'flex','overflow':'hidden','justify-content':'center'}"
                      >
                        <img
                          src="/api/uploads/players/1589730347116-unknown.png"
                          style="max-width:fit-content;max-height: 100%"
                        />
                      </div>
                      <footer class="card-footer" style="height:35px">
                        <div class="card-footer-item">
                          <div style="display:flex">TBD</div>
                        </div>
                      </footer>
                    </div>
                  </div>
                </div>
                <div
                  v-for="player in getTeamPlayers(1)"
                  :key="player._id"
                  :style="{padding:!$device.isMobile?'0 10px 10px 10px':'0 2px 2px 2px','display':'inline-block'}"
                >
                  <div
                    :style="{width:!$device.isMobile?'140px':'70px',height:!$device.isMobile?'140px':'70px','font-size':'13px'}"
                  >
                    <nuxt-link :to="`/players/${player._id}`">
                      <div
                        class="card"
                        :style="{height:!$device.isMobile?'175px':'105px','cursor':'pointer'}"
                      >
                        <div
                          :style="{height:!$device.isMobile?'140px':'70px','width':'100%','display':'flex','overflow':'hidden','justify-content':'center'}"
                        >
                          <img
                            :src="getPlayerImg(player.img)"
                            style="max-width:none;max-height: 100%"
                          />
                        </div>
                        <footer class="card-footer" style="height:35px">
                          <div class="card-footer-item">
                            <div style="display:flex;margin:-15px" v-if="!$device.isMobile">
                              <CountryFlag
                                v-if="player.flag !== undefined"
                                v-bind:country="player.flag"
                                size="small"
                              />
                              <CountryFlag
                                v-if="player.flag === undefined"
                                country="us"
                                size="small"
                                style="visibility:hidden;margin-right:-20px"
                              />
                            </div>
                            <div style="display:flex">{{player.name}}</div>
                          </div>
                        </footer>
                      </div>
                    </nuxt-link>
                  </div>
                </div>
              </div>
              <div
                :style="{'margin-bottom':!$device.isMobile?'1rem':'0.5rem','padding-bottom':!$device.isMobile?'':'10px','background':'#1c2431'}"
              >
                <div
                  class="subtitle"
                  style="display:flex;justify-content:center;padding-top:10px;margin-bottom:20px"
                >
                  <img :src="getImgUrl(match.teamTwo.img)" style="height:1.3em" />
                  &nbsp {{match.teamTwo.name}}
                </div>
                <div
                  v-if="match.teamTwo.activePlayerIds.length==0"
                  :style="{'margin-bottom':!$device.isMobile?'':'-40px'}"
                >
                  <div
                    :style="{width:!$device.isMobile?'140px':'70px','padding-bottom':'10px','font-size':'13px','margin-left':'41%','margin-bottom':'30px'}"
                  >
                    <div
                      class="card"
                      :style="{height:!$device.isMobile?'175px':'105px','cursor':'pointer'}"
                    >
                      <div
                        :style="{height:!$device.isMobile?'140px':'70px','width':'100%','display':'flex','overflow':'hidden','justify-content':'center'}"
                      >
                        <img
                          src="/api/uploads/players/1589730347116-unknown.png"
                          style="max-width:fit-content;max-height: 100%"
                        />
                      </div>
                      <footer class="card-footer" style="height:35px">
                        <div class="card-footer-item">
                          <div style="display:flex">TBD</div>
                        </div>
                      </footer>
                    </div>
                  </div>
                </div>
                <div
                  v-for="player in getTeamPlayers(2)"
                  :key="player._id"
                  :style="{padding:!$device.isMobile?'0 10px 10px 10px':'0 2px 2px 2px','display':'inline-block'}"
                >
                  <div
                    :style="{width:!$device.isMobile?'140px':'70px',height:!$device.isMobile?'140px':'70px','font-size':'13px'}"
                  >
                    <nuxt-link :to="`/players/${player._id}`">
                      <div
                        class="card"
                        :style="{height:!$device.isMobile?'175px':'105px','cursor':'pointer'}"
                      >
                        <div
                          :style="{height:!$device.isMobile?'140px':'70px','width':'100%','display':'flex','overflow':'hidden','justify-content':'center'}"
                        >
                          <img
                            :src="getPlayerImg(player.img)"
                            style="max-width:none;max-height: 100%"
                          />
                        </div>
                        <footer class="card-footer" style="height:35px">
                          <div class="card-footer-item">
                            <div style="display:flex;margin:-15px" v-if="!$device.isMobile">
                              <CountryFlag
                                v-if="player.flag !== undefined"
                                v-bind:country="player.flag"
                                size="small"
                              />
                              <CountryFlag
                                v-if="player.flag === undefined"
                                country="us"
                                size="small"
                                style="visibility:hidden;margin-right:-20px"
                              />
                            </div>
                            <div style="display:flex">{{player.name}}</div>
                          </div>
                        </footer>
                      </div>
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-narrow">
            <div class="subtitle" style="text-align:left">Quarter Winrate</div>
            <div class="card" style="width:800px;margin-bottom:1rem">
              <div>
                <div class="columns is-mobile">
                  <div class="column is-6"></div>
                  <div class="column is-2 subtitle" style="font-size:16px">{{match.teamOne.name}}</div>
                  <div class="column is-2 subtitle" style="font-size:16px">{{match.teamTwo.name}}</div>
                </div>
                <div v-for="map in mapHistory" :key="map._id">
                  <div class="columns is-mobile">
                    <div class="column is-6">
                      <br />
                      <p style="font-size:12px">{{map.name}}</p>
                    </div>
                    <div
                      class="column is-2"
                      v-bind:class="getMapOutcomeClass(map.teamOneWin/(map.teamOneWin+map.teamOneLoss),map.teamTwoWin/(map.teamTwoWin+map.teamTwoLoss))"
                    >
                      <span
                        v-if="(map.teamOneWin+map.teamOneLoss)!=0"
                      >{{((map.teamOneWin/(map.teamOneWin+map.teamOneLoss))*100).toFixed(2)}}%</span>
                      <span v-if="(map.teamOneWin+map.teamOneLoss)==0">0%</span>
                      <br />
                      <p style="font-size:12px">{{map.teamOneLoss+map.teamOneWin}} maps</p>
                    </div>
                    <div
                      class="column is-2"
                      v-bind:class="getMapOutcomeClass(map.teamTwoWin/(map.teamTwoWin+map.teamTwoLoss),map.teamOneWin/(map.teamOneWin+map.teamOneLoss))"
                    >
                      <span
                        v-if="(map.teamTwoWin+map.teamTwoLoss)!=0"
                      >{{((map.teamTwoWin/(map.teamTwoWin+map.teamTwoLoss))*100).toFixed(2)}}%</span>
                      <span v-if="(map.teamTwoWin+map.teamTwoLoss)==0">0%</span>
                      <br />
                      <p style="font-size:12px">{{map.teamTwoLoss+map.teamTwoWin}} maps</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-narrow">
            <div class="subtitle" style="text-align:left">Head to head</div>
            <div class="card" style="width:800px">
              <div class="columns is-mobile">
                <div class="column" v-if="!$device.isMobile"></div>
                <div class="column" style="align-self:center;font-size:18px;display:flex">
                  <img
                    :src="getImgUrl(match.teamOne.img)"
                    style="height:1.6em"
                    v-if="!$device.isMobile"
                  />
                  &nbsp&nbsp&nbsp{{match.teamOne.name}}
                </div>
                <div class="column">
                  <span style="font-weight:bold">{{Math.floor(Math.random() * 5)}}</span>
                  <br />
                  <span style="font-size:14px">{{headToHeadHistory.teamOneWins===1?"Win":"Wins"}}</span>
                </div>

                <div class="column">
                  <span style="font-weight:bold">{{Math.floor(Math.random() * 5)}}</span>
                  <br />
                  <span style="font-size:14px">{{headToHeadHistory.teamTwoWins===1?"Win":"Wins"}}</span>
                </div>
                <div class="column" style="align-self:center;font-size:18px;display:flex">
                  {{match.teamTwo.name}}&nbsp&nbsp&nbsp
                  <img
                    :src="getImgUrl(match.teamTwo.img)"
                    style="height:1.6em"
                    v-if="!$device.isMobile"
                  />
                </div>
                <div class="column" v-if="!$device.isMobile"></div>
              </div>
              <div
                class="card"
                v-for="(match, index) in headToHeadMatches"
                :key="match.id"
                v-bind:class="getBkg(index%2===1)"
                style="cursor:pointer;margin-top:10px;"
              >
                <nuxt-link
                  :to="`/matches/${match._id}/${match.slug}`"
                  style="padding:0px;color:white"
                >
                  <div class="card-content" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                    <div class="columns is-mobile">
                      <div
                        class="column is-3"
                        style="opacity:0.6;margin-left:-10px"
                      >{{formatDateShortFormat(match.dateTime)}}</div>
                      <div class="column is-4-mobile" style="text-align:right">
                        <div
                          style="overflow:hidden;text-overflow: ellipsis;display:inline-block;"
                        >{{match.teamOne.name}}</div>
                        <div
                          style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                        >
                          <img :src="getImgUrl(match.teamOne.img)" alt="Smiley face" />
                        </div>
                      </div>
                      <div class="column is-narrow">
                        <span
                          style="text-align:center;font-weight:bold;"
                          v-bind:class="getOutcomeClass(getWinnerDetails(match.maps).winner === 0)"
                        >{{getWinnerDetails(match.maps).teamOneScore}}</span>
                        <span style="display:inline-block">-</span>
                        <span
                          style="text-align:center;font-weight:bold;display:inline-block"
                          v-bind:class="getOutcomeClass(getWinnerDetails(match.maps).winner === 1)"
                        >{{getWinnerDetails(match.maps).teamTwoScore}}</span>
                      </div>
                      <div class="column is-4-mobile" style="text-align:left">
                        <div
                          style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                        >
                          <img :src="getImgUrl(match.teamTwo.img)" alt="Smiley face" />
                        </div>
                        <div
                          style="overflow:hidden;text-overflow: ellipsis;display:inline-block;width:60%"
                        >{{match.teamTwo.name}}</div>
                      </div>
                      <div
                        v-if="!$device.isMobile"
                        class="column"
                        style="opacity:0.6;overflow:hidden;text-overflow: ellipsis;white-space: nowrap"
                      >{{eventNames[match.event]}}</div>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered" v-if="match.maps[0].playerStatIds.length === 0">
          <div class="column is-narrow">
            <div class="card" style="width:800px">
              <div class="card-content">
                <p>No match stats available</p>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered is-mobile comment-mobile" style="margin-top:10px">
          <div class="column is-narrow">
            <div style="width:410px">
              <Comments
                style="font-size:16px; text-align:center;width:800px"
                :id="$route.params.id"
                :pageData="match"
                type="matches"
                :commentsArray="match.comments"
              />
            </div>
          </div>
        </div>
        <div class="columns is-centered comment-desktop" style="margin-top:10px">
          <div class="column is-narrow">
            <div class="card" style="width:800px">
              <div class="card-content">
                <Comments
                  style="font-size:16px;padding:0px"
                  :id="$route.params.id"
                  :pageData="match"
                  type="matches"
                  :commentsArray="match.comments"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import Comments from "../../../components/Comments/Comments";
import CountryFlag from "vue-country-flag";

const moment = require("moment");
import axios from "axios";
export default {
  name: "Matches",
  props: {
    type: String
  },
  head() {
    if (this.match) {
      return {
        title: this.match.teamOne.name + " vs " + this.match.teamTwo.name,
        meta: [
          { name: "twitter:card", content: "summary_large_image" },
          {
            name: "twitter:title",
            content: this.match.teamOne.name + " vs " + this.match.teamTwo.name
          },
          // image must be an absolute path
          {
            name: "twitter:image",
            content:
              "https://files.cults3d.com/uploaders/15024335/illustration-file/a86d53e4-2bd9-4a8f-9550-986686c3131a/gi0mAjIh_400x400_large.png"
          }
        ]
      };
    }
    return {};
  },
  asyncData({ params }) {
    let match = undefined;
    let score = ["-", "-"];
    let map = undefined;
    let players = {};
    let counter = 0;
    let showTwitch = false;
    let teamOneStats = [];
    let teamTwoStats = [];
    let matchHistory = [];
    let matchEvent = undefined;
    let mapHistory = {};
    let headToHeadMatches = [];
    let headToHeadHistory = {};
    let eventNames = {};
    let viewMap = 0;
    let streamIndex = 0;
    return axios
      .get(
        'https://macvars.herokuapp.com/' +
          `api/matches/${params.id}?&populatemaps=true&populatecomments=true&populatematchplayers=true`
      )
      .then(response => {
        match = response.data;

        return axios
          .all([
            axios.get('https://macvars.herokuapp.com/' + `api/gamemaps`),
            axios.get('https://macvars.herokuapp.com/' + `api/events`),
            axios.get(
              // all matches of both teams - with dateTime < match.dateTime
              'https://macvars.herokuapp.com/' +
                `api/matches?active=false&$or[0][$and][0][teamOneId][$in]=${match.teamOne._id}&$or[0][$and][0][teamOneId][$in]=${match.teamTwo._id}&$or[0][$and][1][dateTime][$lt]=${match.dateTime}&$or[1][$and][0][teamTwoId][$in]=${match.teamOne._id}&$or[1][$and][0][teamTwoId][$in]=${match.teamTwo._id}&$or[1][$and][1][dateTime][$lt]=${match.dateTime}&populatemapsonly=true`
            ),
            axios.get(
              // only matches of team1 vs team2 (or team2 vs team1) - head to head - with dateTime < match.dateTime
              'https://macvars.herokuapp.com/' +
                `api/matches?active=false&$or[0][$and][0][teamOneId]=${match.teamOne._id}&$or[0][$and][1][teamTwoId]=${match.teamTwo._id}&$or[0][$and][2][dateTime][$lt]=${match.dateTime}&$or[1][$and][0][teamOneId]=${match.teamTwo._id}&$or[1][$and][1][teamTwoId]=${match.teamOne._id}&$or[1][$and][2][dateTime][$lt]=${match.dateTime}&populatemapsonly=true`
            ),
            axios.get('https://macvars.herokuapp.com/' + `api/teams/${match.teamOneId}`),
            axios.get('https://macvars.herokuapp.com/' + `api/teams/${match.teamTwoId}`)
          ])
          .then(
            axios.spread(
              (
                gamemapsRaw,
                eventsRaw,
                matchStatsRaw,
                headToHeadStatsRaw,
                teamOneRaw,
                teamTwoRaw
              ) => {
                // Event names
                eventsRaw.data.data.forEach(event => {
                  eventNames[event._id] = event.name;
                });

                // --- Head to Head history ---
                headToHeadMatches = headToHeadStatsRaw.data.data;
                headToHeadHistory.teamOneWins = 0;
                headToHeadHistory.teamTwoWins = 0;
                for (let i = 0; i < headToHeadMatches.length; i++) {
                  // Extract match score
                  let teamOneScore = 0;
                  let teamTwoScore = 0;
                  if (headToHeadMatches[i].maps.length === 1) {
                    teamOneScore = headToHeadMatches[i].maps[0].teamOneScore;
                    teamTwoScore = headToHeadMatches[i].maps[0].teamTwoScore;
                  } else {
                    for (let j = 0; j < headToHeadMatches[i].maps.length; j++) {
                      if (
                        parseInt(headToHeadMatches[i].maps[j].teamOneScore) >=
                          13 &&
                        parseInt(headToHeadMatches[i].maps[j].teamOneScore) >
                          parseInt(headToHeadMatches[i].maps[j].teamTwoScore)
                      ) {
                        teamOneScore += 1;
                      }
                      if (
                        parseInt(headToHeadMatches[i].maps[j].teamTwoScore) >=
                          13 &&
                        parseInt(headToHeadMatches[i].maps[j].teamOneScore) <
                          parseInt(headToHeadMatches[i].maps[j].teamTwoScore)
                      ) {
                        teamTwoScore += 1;
                      }
                    }
                  }
                  if (headToHeadMatches[i].teamOneId === match.teamOneId) {
                    if (teamOneScore > teamTwoScore) {
                      headToHeadHistory.teamOneWins++;
                    }
                    if (teamOneScore < teamTwoScore) {
                      headToHeadHistory.teamTwoWins++;
                    }
                  }
                  if (headToHeadMatches[i].teamOneId === match.teamTwoId) {
                    if (teamOneScore > teamTwoScore) {
                      headToHeadHistory.teamTwoWins++;
                    }
                    if (teamOneScore < teamTwoScore) {
                      headToHeadHistory.teamOneWins++;
                    }
                  }
                }

                // --- Map winrates ---
                //gamemaps fetch
                mapHistory = gamemapsRaw.data.data;
                //map stats
                matchHistory = matchStatsRaw.data.data;
                for (let k = 0; k < mapHistory.length; k++) {
                  mapHistory[k].teamOneWin = 0;
                  mapHistory[k].teamTwoWin = 0;
                  mapHistory[k].teamTwoLoss = 0;
                  mapHistory[k].teamOneLoss = 0;
                }
                for (let i = 0; i < matchHistory.length; i++) {
                  for (let j = 0; j < matchHistory[i].maps.length; j++) {
                    if (matchHistory[i].teamOneId === match.teamOneId) {
                      if (
                        parseInt(matchHistory[i].maps[j].teamOneScore) >
                        parseInt(matchHistory[i].maps[j].teamTwoScore)
                      ) {
                        for (let k = 0; k < mapHistory.length; k++) {
                          if (
                            matchHistory[i].maps[j] &&
                            mapHistory[k]._id === matchHistory[i].maps[j].mapId
                          ) {
                            if (mapHistory[k].teamOneWin) {
                              mapHistory[k].teamOneWin += 1;
                            } else {
                              mapHistory[k].teamOneWin = 1;
                            }
                          }
                        }
                      } else {
                        for (let k = 0; k < mapHistory.length; k++) {
                          if (
                            mapHistory[k]._id === matchHistory[i].maps[j].mapId
                          ) {
                            if (mapHistory[k].teamOneLoss) {
                              mapHistory[k].teamOneLoss += 1;
                            } else {
                              mapHistory[k].teamOneLoss = 1;
                            }
                          }
                        }
                      }
                    }
                    if (matchHistory[i].teamTwoId === match.teamOneId) {
                      if (
                        parseInt(matchHistory[i].maps[j].teamTwoScore) >
                        parseInt(matchHistory[i].maps[j].teamOneScore)
                      ) {
                        for (let k = 0; k < mapHistory.length; k++) {
                          if (
                            mapHistory[k]._id === matchHistory[i].maps[j].mapId
                          ) {
                            if (mapHistory[k].teamOneWin) {
                              mapHistory[k].teamOneWin += 1;
                            } else {
                              mapHistory[k].teamOneWin = 1;
                            }
                          }
                        }
                      } else {
                        for (let k = 0; k < mapHistory.length; k++) {
                          if (
                            mapHistory[k]._id === matchHistory[i].maps[j].mapId
                          ) {
                            if (mapHistory[k].teamOneLoss) {
                              mapHistory[k].teamOneLoss += 1;
                            } else {
                              mapHistory[k].teamOneLoss = 1;
                            }
                          }
                        }
                      }
                    }
                    if (matchHistory[i].teamOneId === match.teamTwoId) {
                      if (
                        parseInt(matchHistory[i].maps[j].teamOneScore) >
                        parseInt(matchHistory[i].maps[j].teamTwoScore)
                      ) {
                        for (let k = 0; k < mapHistory.length; k++) {
                          if (
                            mapHistory[k]._id === matchHistory[i].maps[j].mapId
                          ) {
                            if (mapHistory[k].teamTwoWin) {
                              mapHistory[k].teamTwoWin += 1;
                            } else {
                              mapHistory[k].teamTwoWin = 1;
                            }
                          }
                        }
                      } else {
                        for (let k = 0; k < mapHistory.length; k++) {
                          if (
                            mapHistory[k]._id === matchHistory[i].maps[j].mapId
                          ) {
                            if (mapHistory[k].teamTwoLoss) {
                              mapHistory[k].teamTwoLoss += 1;
                            } else {
                              mapHistory[k].teamTwoLoss = 1;
                            }
                          }
                        }
                      }
                    }
                    if (matchHistory[i].teamTwoId === match.teamTwoId) {
                      if (
                        parseInt(matchHistory[i].maps[j].teamTwoScore) >
                        parseInt(matchHistory[i].maps[j].teamOneScore)
                      ) {
                        for (let k = 0; k < mapHistory.length; k++) {
                          if (
                            mapHistory[k]._id === matchHistory[i].maps[j].mapId
                          ) {
                            if (mapHistory[k].teamTwoWin) {
                              mapHistory[k].teamTwoWin += 1;
                            } else {
                              mapHistory[k].teamTwoWin = 1;
                            }
                          }
                        }
                      } else {
                        if (matchHistory[i].maps[j].map.name === "Haven") {
                          // console.log(matchHistory[i].maps[j]);
                        }
                        for (let k = 0; k < mapHistory.length; k++) {
                          if (
                            mapHistory[k]._id === matchHistory[i].maps[j].mapId
                          ) {
                            if (mapHistory[k].teamTwoLoss) {
                              mapHistory[k].teamTwoLoss += 1;
                            } else {
                              mapHistory[k].teamTwoLoss = 1;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                //setting map
                map = match.maps[0];
                //team one
                let teamOneData = teamOneRaw.data;
                teamOneData.players.forEach(player => {
                  players[player._id] = player;
                });
                //team two
                let teamTwoData = teamTwoRaw.data;
                teamTwoData.players.forEach(player => {
                  players[player._id] = player;
                });
                counter++;

                //return data
                return {
                  match,
                  score,
                  map,
                  players,
                  counter,
                  showTwitch,
                  teamOneStats,
                  teamTwoStats,
                  matchHistory,
                  mapHistory,
                  headToHeadMatches,
                  headToHeadHistory,
                  eventNames,
                  viewMap,
                  matchEvent,
                  streamIndex
                };
              }
            )
          )

          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  },
  mounted() {
    this.$axios('https://macvars.herokuapp.com/' + `api/events/${this.match.event}`, {
      method: "get",
      headers: {
        "content-type": "application/json"
      }
    })
      .then(function(response) {
        return response.data;
      })
      .then(response => {
        this.matchEvent = response;
      });
  },
  methods: {
    filterTeamPlayers(stats, team) {
      const total = [];
      if (team === 1) {
        for (let i = 0; i < stats.length; i++) {
          if (this.match.teamOne.playerIds.includes(stats[i].playerId)) {
            total.push(stats[i]);
          }
        }
      } else {
        for (let i = 0; i < stats.length; i++) {
          if (this.match.teamTwo.playerIds.includes(stats[i].playerId)) {
            total.push(stats[i]);
          }
        }
      }

      return total;
    },
    getImgUrl(team) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${team}`;
    },
    getPlayerImg(id) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/players/${id}`;
    },
    getMapImg(name) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/maps/${name}`;
    },
    getBkg(type) {
      if (type) {
        return "light-bkg";
      } else {
        return "dark-bkg";
      }
    },
    getWinnerDetails(maps) {
      const details = {};
      let oneCount = 0;
      let twoCount = 0;
      for (let i = 0; i < maps.length; i++) {
          oneCount += parseInt(maps[i].teamOneScore);
          twoCount += parseInt(maps[i].teamTwoScore);
      }
      details.teamOneScore = oneCount;
      details.teamTwoScore = twoCount;
      if (oneCount > twoCount) {
        details.winner = 0;
      } else if (oneCount < twoCount) {
        details.winner = 1;
      } else {
        details.winner = -1;
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
    getLiveOutcomeClass(one, two) {
      if (parseInt(one) > parseInt(two)) {
        return "winner";
      } else if (parseInt(two) > parseInt(one)) {
        return "loser";
      }
    },
    fillTeamsArr() {
      this.$axios('https://macvars.herokuapp.com/' + `api/teams/${this.match.teamOneId}`, {
        method: "get"
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {
          response.players.forEach(player => {
            this.players[player._id] = player;
          });
          this.$axios(
            'https://macvars.herokuapp.com/' + `api/teams/${this.match.teamTwoId}`,
            {
              method: "get"
            }
          )
            .then(function(response) {
              return response.data;
            })
            .then(response => {
              response.players.forEach(player => {
                this.players[player._id] = player;
              });
            });
        });
    },
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("DD-MM-YYYY h:mm a");
    },
    formatDateShortFormat(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MM/DD h:mm a");
    },
    setMap(index) {
      const total = {};
      if (index === -1) {
        for (let i = 0; i < this.match.maps.length; i++) {
          if (i === 0) {
            total.playerStats = JSON.parse(
              JSON.stringify(this.match.maps[i].playerStats)
            );
          } else {
            for (let j = 0; j < this.match.maps[i].playerStats.length; j++) {
              for (const key in this.match.maps[i].playerStats[j]) {
                if (key !== "playerId" && key !== "agent") {
                  total.playerStats[j][key] += this.match.maps[i].playerStats[
                    j
                  ][key];
                }
              }
              if(i == this.match.maps.length - 1){
              total.playerStats[j]["avgCombatScore"] = Math.round(
                total.playerStats[j]["avgCombatScore"] / this.match.maps.length
              );
              total.playerStats[j]["econRating"] = Math.round(
                total.playerStats[j]["econRating"] / this.match.maps.length
              );
               total.playerStats[j]["rating"] = total.playerStats[j]["rating"] / this.match.maps.length
              }
            }
          }
        }
        this.map = total;
      } else {
        this.map = this.match.maps[index];
      }
    },
    navPlayerPage(id) {
      this.$router.push({ path: `/players/${id}` });
    },
    navPlayer(row) {
      this.$router.push({ path: `/players/${row.playerId}` });
    },
    getStream() {
      return `https://player.twitch.tv/?channel=${
        this.match.streams[this.streamIndex]
      }&parent=ggddg.com&muted=true`;
    },
    getTeamPlayers(teamNum){
      let total = [];
      if(teamNum == 1){
        for(let i =0;i<this.match.activePlayers.length;i++){
          if(this.match.teamOne.playerIds.indexOf(this.match.activePlayers[i]._id)!=-1){
            total.push(this.match.activePlayers[i])
          }
        }
      }
      if(teamNum == 2){
        for(let i =0;i<this.match.activePlayers.length;i++){
          if(this.match.teamTwo.playerIds.indexOf(this.match.activePlayers[i]._id)!=-1){
            total.push(this.match.activePlayers[i])
          }
        }
      }
      return total;
    },
    getAgent(img) {
      if (img) {
        return 'https://macvars.herokuapp.com/' + `api/uploads/agents/${img}`;
      } else {
        return 'https://macvars.herokuapp.com/' + `api/uploads/agents/unknown.png`;
      }
    },
    processMapHistory() {},
    getMapOutcomeClass(percentOne, percentTwo) {
      if (percentOne < percentTwo) {
        return "map-loser";
      }
    }
  },
  components: { Comments, CountryFlag }
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
@media screen and (min-width: 640px) {
  .hello {
    height: 100vh;
  }
  .comment-mobile {
    visibility: hidden;
    display: none;
  }
}
@media screen and (max-width: 640px) {
  .hello {
    height: 100%;
  }
  .comment-desktop {
    visibility: hidden;
    display: none;
  }
}
.winner {
  color: limegreen;
}
.loser {
  color: orangered;
}
.map-loser {
  opacity: 0.4;
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  font-weight: bold;
  transform: translate(-50%, -65%);
}
.container-img {
  position: relative;
  text-align: center;
  color: white;
}
.light-bkg {
}
.dark-bkg {
  background-color: #1a212e;
}
table
{
    table-layout: fixed;
    width: 100px;
}
</style>