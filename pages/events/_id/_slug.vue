<template style="height:100%">
  <div class="hello" style="height:100%" v-if="currentEvent">
    <h1 style="font-size:50px;margin-bottom:20px">{{currentEvent.name}}</h1>
    <div class="columns is-centered">
      <div class="column is-narrow">
        <div :style="{width:!$device.isMobile?'800px':'' }">
          <div class="card">
            <div class="card-content">
              <div class="columns is-centered is-vcentered">
                <div class="column is-6">
                  <img :src="getImgUrl()" width="500px" />
                </div>
                <div class="column is-6" style="text-align: left">
                  <div>
                    <span>
                      <p
                        class="title"
                        style="display: inline-block;color:#ff726f; text-align: left;font-size:19px"
                      >Date:</p>
                      <p
                        v-if="currentEvent.date.from.substr(0,10) !== currentEvent.date.to.substr(0,10)"
                        class="title"
                        style="display: inline-block;font-size:19px"
                      >{{formatDateEvent(currentEvent.date.from)}} - {{formatDateEvent(currentEvent.date.to)}}</p>
                      <p
                        v-if="currentEvent.date.from.substr(0,10) === currentEvent.date.to.substr(0,10)"
                        class="title"
                        style="display: inline-block;font-size:19px"
                      >{{formatDateEvent(currentEvent.date.from)}}</p>
                    </span>
                  </div>
                  <div>
                    <span>
                      <p
                        class="title"
                        style="display: inline-block;color:#ff726f; text-align: left;font-size:19px"
                      >Teams:</p>
                      <p
                        class="title"
                        style="display: inline-block;font-size:19px"
                      >{{currentEvent.numberOfTeams}}</p>
                    </span>
                  </div>
                  <div v-if="currentEvent.totalPrizePool !== undefined">
                    <span>
                      <p
                        class="title"
                        style="display: inline-block;color:#ff726f; text-align: left;font-size:19px"
                      >Prize Pool:</p>
                      <p
                        class="title"
                        style="display: inline-block;font-size:19px"
                      >{{currentEvent.totalPrizePool}}</p>
                    </span>
                  </div>
                  <div v-if="currentEvent.location !== undefined">
                    <span>
                      <p
                        class="title"
                        style="display: inline-block;color:#ff726f; text-align: left;font-size:19px"
                      >Location:</p>
                      <p
                        class="title"
                        style="display: inline-block;font-size:19px"
                      >{{currentEvent.location}}</p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-centered" style="margin-top:15px">
          <div class="column is-narrow">
            <div :style="{width:!$device.isMobile?'800px':'' }">
              <div class="card">
                <div
                  style="padding-top: 0.5rem; padding-bottom: 0.5rem; margin-bottom:0px;"
                  class="card-content"
                >
                  <b-tabs
                    v-model="tabIndex"
                    @change="inc +=1;changeTab()"
                    type="is-boxed"
                    class="tabsMyStats"
                    position="is-centered"
                    style="min-height:700px;padding:0px"
                    :key="inc"
                  >
                    <b-tab-item label="Overview" :key="inc">
                      <div class="columns is-centered">
                        <div class="column is-full">
                          <div style="text-align:left">
                            <div v-bind:class="getDescriptionWidthClass()">
                              <p class="subtitle">
                                <vue-markdown :key="inc">{{currentEvent.details}}</vue-markdown>
                              </p>
                            </div>
                            <!-- <div class="columns is-centered is-mobile" style="margin-top:20px">
                              <div v-if="currentEvent.prizePoolTable !== undefined">
                                <div style="text-align:center">
                                  <b-table
                                    :data="currentEvent.prizePoolTable"
                                    :bordered="true"
                                    :striped="true"
                                    :hoverable="true"
                                    :mobile-cards="false"
                                    style="width:300px"
                                  >
                                    <template slot-scope="props">
                                      <b-table-column
                                        field="place"
                                        label="Place"
                                        width="10%"
                                      >{{props.row.place}}</b-table-column>
                                      <b-table-column
                                        v-if="currentEvent.prizePoolTable[0].prize !== '-'"
                                        field="prize"
                                        label="Prize"
                                        width="10%"
                                      >{{props.row.prize}}</b-table-column>
                                      <b-table-column
                                        v-if="currentEvent.prizePoolTable[0].teamId !== '-'"
                                        field="name"
                                        label="Team"
                                        width="80%"
                                      >
                                        <div
                                          @click="navTeam(props.row.teamId)"
                                          v-if="props.row.place == '1'"
                                          style="cursor:pointer"
                                        >
                                          {{props.row.name}}
                                          <i
                                            style="color:gold"
                                            class="fas fa-trophy"
                                          ></i>
                                        </div>
                                        <div
                                          @click="navTeam(props.row.teamId)"
                                          v-if="props.row.place !== '1' && props.row.place !== '3/4'"
                                          style="cursor:pointer"
                                        >{{props.row.name}}</div>
                                        <div
                                          v-if="props.row.place == '3/4' && props.row.name !== undefined"
                                        >
                                          <p
                                            @click="navTeam(props.row.teamId.split(' ')[0])"
                                            style="cursor:pointer"
                                          >{{props.row.name.split(' ')[0]}}</p>
                                          <p
                                            @click="navTeam(props.row.teamId.split(' ')[1])"
                                            style="cursor:pointer"
                                          >{{props.row.name.split(' ')[1]}}</p>
                                        </div>
                                      </b-table-column>
                                    </template>
                                  </b-table>
                                </div>
                              </div>
                            </div> -->
                          </div>
                        </div>
                      </div>
                    </b-tab-item>
                    <b-tab-item label="Teams">
                      <div class="columns is-centered">
                        <div class="column is-full">
                          <div style="text-align:center;padding:0px">
                            <div
                              v-for="team in currentEvent.teams"
                              :key="team._id"
                              style="padding:10px;display:inline-block;text-align:left"
                            >
                              <div
                                class="card team-card"
                                style="width:150px; margin-right:auto;margin-left:auto;padding:0px;background-color:#273142"
                              >
                                <div
                                  class="card-content"
                                  style="padding:10px;cursor:pointer"
                                  @click="navTeam(team._id)"
                                >
                                  <div
                                    style="width:35px;height:35px;overflow: hidden;margin-left: auto;margin-right: auto;cursor:pointer;"
                                  >
                                    <img
                                      :src="getTeamImgUrl(team.img)"
                                      style="border-radius: 50%;"
                                      alt="Avatar"
                                      @click="navTeam(team._id)"
                                    />
                                  </div>
                                  <p
                                    @click="navTeam(team._id)"
                                    class="title"
                                    style="text-align:center;font-size:15px;cursor:pointer"
                                  >{{team.name}}</p>
                                  <div style="margin-top:-20px;">
                                    <div v-for="player in team.players" :key="player._id">
                                      <div
                                        style="margin-left:10px;font-size:14px;"
                                        v-if="currentEvent.teamsObj!=undefined && (currentEvent.teamsObj[team._id].indexOf(player._id)!=-1)"
                                      >{{player.name}}</div>
                                      <div
                                        style="margin-left:10px;font-size:14px;"
                                        v-if="currentEvent.teamsObj==undefined && (currentEvent.activePlayerIds == undefined || currentEvent.activePlayerIds.indexOf(player._id)!=-1)"
                                      >{{player.name}}</div>
                                    </div>
                                    <div v-if="team.players.length ===0" style="font-size:14px;">
                                      TBA
                                      <br />TBA
                                      <br />TBA
                                      <br />TBA
                                      <br />TBA
                                      <br />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </b-tab-item>
                    <b-tab-item label="Reg season" :disabled ="groups.length == 0">
                      <div class="column is-full">
                        <!-- <p class="title">Group stage</p> -->
                        <div style="text-align:center;">
                          <div v-if="groups.length != 0">
                            <div
                              v-for="(group, index) in groups"
                              :key="group._id"
                              style="padding:10px;display:inline-block;"
                            >
                              <div
                                v-bind:style="group[0].eventStats[currentEvent._id].groupStageWins !== undefined?'min-width:275px':'min-width:220px'"
                                style="margin-left:auto;margin-right:auto;"
                              >
                                <div v-if="index === 0">Group A</div>
                                <div v-if="index === 1">Group B</div>
                                <div v-if="index === 2">Group C</div>
                                <div v-if="index === 3">Group D</div>
                                <div v-if="index === 4">Group E</div>
                                <div v-if="index === 5">Group F</div>
                                <b-table
                                  :data="group"
                                  :bordered="true"
                                  class="table is-narrow is-bordered"
                                  :striped="true"
                                  :hoverable="true"
                                  :mobile-cards="false"
                                  v-bind:style="group[0].eventStats[currentEvent._id].groupStageWins !== undefined?'min-width:275px':'min-width:220px'"
                                  style="font-size:15px;display:inline-block;min-height:100px"
                                >
                                  <template slot-scope="props">
                                    <b-table-column
                                      field="num"
                                      label="#"
                                      v-bind:class="getOutcomeClass(props.row.advanced)"
                                    >
                                      <div style="text-align:left;font-size:14px">{{props.index+1}}</div>
                                    </b-table-column>
                                    <b-table-column
                                      field="name"
                                      label="Team"
                                      v-bind:class="getOutcomeClass(props.row.advanced)"
                                    >
                                      <img
                                        style="vertical-align:middle;width:20px;height:20px;"
                                        :src="getTeamImgUrl(props.row.img)"
                                      />
                                      <span style>{{props.row.name}}</span>
                                    </b-table-column>
                                    <b-table-column
                                      v-if="props.row.eventStats[currentEvent._id].groupStageWins !== undefined"
                                      field="W-L"
                                      label="W-L"
                                      v-bind:class="getOutcomeClass(props.row.advanced)"
                                    >{{props.row.eventStats[currentEvent._id].groupStageWins}}-{{props.row.eventStats[currentEvent._id].groupStageLoses}}</b-table-column>
                                    <b-table-column
                                      v-if="props.row.eventStats[currentEvent._id].groupStageWins !== undefined"
                                      field="Diff"
                                      label="Diff"
                                      v-bind:class="getOutcomeClass(props.row.advanced)"
                                    >
                                      {{((props.row.eventStats[currentEvent._id].groupStageRoundsLost
                                      - props.row.eventStats[currentEvent._id].groupStageRoundsWon) >= 0?"":"+") + (props.row.eventStats[currentEvent._id].groupStageRoundsWon
                                      - props.row.eventStats[currentEvent._id].groupStageRoundsLost)}}
                                    </b-table-column>
                                    <b-table-column
                                      field="eventStats"
                                      label="P"
                                      style="text-align:center;vertical-align: middle;font-weight:bold;font-size:14px"
                                      v-bind:class="getOutcomeClass(props.row.advanced)"
                                      numeric
                                    >{{parseInt(props.row.eventStats[currentEvent._id].points)}}</b-table-column>
                                  </template>
                                </b-table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </b-tab-item>
                    <b-tab-item
                      label="Playoffs"
                      :disabled="currentEvent.displayPlayoffs === undefined || (currentEvent.displayPlayoffs != true && currentEvent.displayPlayoffs != 'true' )"
                    >
                      <div class="column is-full" style="overflow-x: auto;overflow-y: hidden">
                        <!-- <p class="title">Play offs</p> -->
                        <div
                          v-if="currentEvent._id !== '5eade90dcbef166af9f74173' && currentEvent._id !== '5ebe15be61ccad7d83b3f302' "
                        >
                          <div v-if="currentEvent.playoffs.length>0" :key="inc">
                            <Bracket
                              :playoffData="currentEvent.playoffs[0]"
                              :eventId="currentEvent._id"
                            />
                          </div>
                          <div style="text-align:left" v-if="currentEvent.playoffs.length<=0">
                            <p class="subtitle">TBA</p>
                          </div>
                        </div>
                        <div v-if="currentEvent._id === '5eade90dcbef166af9f74173'">
                          <img src="../../../assets/playoff.png" />
                        </div>
                        <div
                          style="height:900px"
                          v-if="currentEvent._id === '5ebe15be61ccad7d83b3f302'"
                        >
                          <iframe
                            src="https://challonge.com/bovbbnzs/module"
                            width="100%"
                            frameborder="0"
                            scrolling="auto"
                            allowtransparency="true"
                            style="height: 100%; border: none"
                          ></iframe>
                        </div>
                      </div>
                    </b-tab-item>
                    <b-tab-item label="Matches" style="padding:0px">
                      <div class="column is-full" style="padding:0px">
                        <!-- <p class="title">Matches</p> -->
                        <div style="text-align:left;padding:0px">
                          <p
                            class="subtitle"
                            v-if="matches.length ==0 && finishedMatches.length ==0"
                          >TBA</p>
                          <p style="text-align:left;" v-if="matches.length!=0">Upcoming Matches</p>
                          <div
                            class="card"
                            v-for="(match, index) in matches"
                            :key="match.id"
                            v-bind:class="getBkg(index%2===0)"
                            style="cursor:pointer;margin-top:10px;padding:0px"
                          >
                            <nuxt-link
                              :to="`/matches/${match._id}/${match.slug}`"
                              style="padding:0px;color:white"
                            >
                              <div
                                class="card-content"
                                style="padding:0px;padding-top:0.5em;padding-bottom:0.5em;padding-left:10px"
                              >
                                <div class="columns is-mobile">
                                  <div
                                    class="column is-3"
                                    v-if="!$device.isMobile"
                                    style="opacity:0.6"
                                  >{{formatDate(match.dateTime)}}</div>
                                  <div class="column is-5" style="text-align:right">
                                    <div
                                      style="overflow:hidden;text-overflow: ellipsis;display:inline-block;white-space: nowrap;max-width: 95%;"
                                      :style="{'font-size':$device.isMobile?'12px':''}"
                                    >{{match.teamOne.name}}</div>
                                    <div
                                      style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                                    >
                                      <img
                                        :src="getTeamImgUrl(match.teamOne.img)"
                                        alt="Smiley face"
                                      />
                                    </div>
                                  </div>
                                  <div class="column is-narrow">
                                    <span v-if="!isLive(match)" style="display:inline-block">vs.</span>
                                    <span
                                      v-if="isLive(match)"
                                      style="text-align:center;font-weight:bold;"
                                      v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 0)"
                                    >{{getWinnerDetails(match).teamOneScore}}</span>
                                    <span style="display:inline-block" v-if="isLive(match)">-</span>
                                    <span
                                      v-if="isLive(match)"
                                      style="text-align:center;font-weight:bold;display:inline-block"
                                      v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 1)"
                                    >{{getWinnerDetails(match).teamTwoScore}}</span>
                                  </div>
                                  <div class="column is-narrow" style="text-align:left">
                                    <div
                                      style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                                    >
                                      <img
                                        :src="getTeamImgUrl(match.teamTwo.img)"
                                        alt="Smiley face"
                                      />
                                    </div>
                                    <div
                                      :style="{'font-size':$device.isMobile?'12px':''}"
                                      style="overflow:hidden;text-overflow: ellipsis;display:inline-block;white-space: nowrap;max-width: 95%;"
                                    >{{match.teamTwo.name}}</div>
                                  </div>
                                </div>
                              </div>
                            </nuxt-link>
                          </div>
                          <!-- <b-table
                        v-if="matches.length!=0"
                        :mobile-cards="false"
                        :data="matches"
                        :striped="true"
                        style="width:100%;cursor:pointer;font-size:14px"
                        :hoverable="true"
                        @click="(row)=>navMatch(row._id, row.slug)"
                      >
                        <template slot-scope="props">
                          <b-table-column label="Date/Time" field="id">
                            <div style="text-align:left">{{formatDate(props.row.dateTime)}}</div>
                          </b-table-column>
                          <b-table-column label="Teams" field="id">
                            <div
                              style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                            >
                              <img
                                :src="getTeamImgUrl(props.row.teamOne.img)"
                                style="border-radius:50%"
                                alt="Smiley face"
                              />
                            </div>
                            <div
                              style="width:100px;overflow:hidden;text-overflow: ellipsis;display:inline-block; margin-bottom:3px; margin-left:5px;"
                            >{{props.row.teamOne.name}}</div>
                          </b-table-column>
                          <b-table-column label="Team Two" field="name">
                            <div
                              style="width:25px;height:25px;overflow: hidden;display:inline-block"
                            >
                              <img
                                :src="getTeamImgUrl(props.row.teamTwo.img)"
                                style="border-radius:50%"
                                alt="Smiley face"
                              />
                            </div>
                            <div
                              style="width:100px;overflow:hidden;text-overflow: ellipsis;display:inline-block; margin-bottom:3px; margin-left:5px"
                            >{{props.row.teamTwo.name}}</div>
                          </b-table-column>
                        </template>
                          </b-table>-->
                          <p style="text-align:left;margin-top:50px">Finished Matches</p>
                          <div
                            class="card"
                            v-for="(match, index) in finishedMatches"
                            :key="match.id"
                            v-bind:class="getBkg(index%2===0)"
                            style="cursor:pointer;margin-top:10px;padding:0px"
                          >
                            <nuxt-link
                              :to="`/matches/${match._id}/${match.slug}`"
                              style="padding:0px;color:white"
                            >
                              <div
                                class="card-content"
                                style="padding:0px;padding-top:0.5em;padding-bottom:0.5em;padding-left:10px"
                              >
                                <div class="columns is-mobile">
                                  <div
                                    class="column is-3"
                                    style="opacity:0.6"
                                    v-if="!$device.isMobile"
                                  >{{formatDate(match.dateTime)}}</div>
                                  <div class="column is-5" style="text-align:right">
                                    <div
                                      :style="{'font-size':$device.isMobile?'12px':''}"
                                      style="overflow:hidden;text-overflow: ellipsis;display:inline-block;white-space: nowrap;max-width: 95%;"
                                    >{{match.teamOne.name}}</div>
                                    <div
                                      style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                                    >
                                      <img
                                        :src="getTeamImgUrl(match.teamOne.img)"
                                        alt="Smiley face"
                                      />
                                    </div>
                                  </div>
                                  <div class="column is-narrow">
                                    <span
                                      style="text-align:center;font-weight:bold;"
                                      v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 0)"
                                    >{{getWinnerDetails(match).teamOneScore}}</span>
                                    <span style="display:inline-block">-</span>
                                    <span
                                      style="text-align:center;font-weight:bold;display:inline-block"
                                      v-bind:class="getOutcomeClass(getWinnerDetails(match).winner === 1)"
                                    >{{getWinnerDetails(match).teamTwoScore}}</span>
                                  </div>
                                  <div class="column is-narrow" style="text-align:left">
                                    <div
                                      style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                                    >
                                      <img
                                        :src="getTeamImgUrl(match.teamTwo.img)"
                                        alt="Smiley face"
                                      />
                                    </div>
                                    <div
                                      :style="{'font-size':$device.isMobile?'12px':''}"
                                      style="overflow:hidden;text-overflow: ellipsis;display:inline-block;white-space: nowrap;max-width: 95%;"
                                    >{{match.teamTwo.name}}</div>
                                  </div>
                                </div>
                              </div>
                            </nuxt-link>
                          </div>
                          <!-- <b-table
                        :mobile-cards="false"
                        :data="finishedMatches"
                        :striped="true"
                        :hoverable="true"
                        style="width:100%;cursor:pointer;font-size:14px"
                        @click="(row)=>navMatch(row._id, row.slug)"
                      >
                        <template slot-scope="props">
                          <b-table-column label="Date/Time" field="id">
                            <div style="text-align:left">{{formatDate(props.row.dateTime)}}</div>
                          </b-table-column>
                          <b-table-column label="Teams" field="id">
                            <div
                              style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                              v-bind:class="getOutcomeClass(getWinnerDetails(props.row.maps).winner === 0)"
                            >
                              <img
                                :src="getTeamImgUrl(props.row.teamOne.img)"
                                style="border-radius:50%"
                                alt="Smiley face"
                              />
                            </div>
                            <div
                              style="width:100px;overflow:hidden;text-overflow: ellipsis;display:inline-block; margin-bottom:3px; margin-left:5px;"
                              v-bind:class="getOutcomeClass(getWinnerDetails(props.row.maps).winner === 0)"
                            >{{props.row.teamOne.name}}</div>
                            <br />
                            <div
                              style="width:25px;height:25px;overflow: hidden;display:inline-block;text-align:left"
                              v-bind:class="getOutcomeClass(getWinnerDetails(props.row.maps).winner === 1)"
                            >
                              <img
                                :src="getTeamImgUrl(props.row.teamTwo.img)"
                                style="border-radius:50%"
                                alt="Smiley face"
                              />
                            </div>
                            <div
                              style="width:100px;overflow:hidden;text-overflow: ellipsis;display:inline-block; margin-bottom:3px; margin-left:5px;"
                              v-bind:class="getOutcomeClass(getWinnerDetails(props.row.maps).winner === 1)"
                            >{{props.row.teamTwo.name}}</div>
                          </b-table-column>
                          <b-table-column label="Score" field="name">
                            <div
                              style="text-align:center;font-weight:bold"
                              v-bind:class="getOutcomeClass(getWinnerDetails(props.row.maps).winner === 0)"
                            >{{getWinnerDetails(props.row.maps).teamOneScore}}</div>
                            <div
                              style="text-align:center;font-weight:bold;margin-top:10px"
                              v-bind:class="getOutcomeClass(getWinnerDetails(props.row.maps).winner === 1)"
                            >{{getWinnerDetails(props.row.maps).teamTwoScore}}</div>
                          </b-table-column>
                        </template>
                          </b-table>-->
                        </div>
                      </div>
                    </b-tab-item>
                    <!-- <b-tab-item label="Stats">
                      <eventStats v-if="inc >= 5" v-bind:eventId="currentEvent._id"></eventStats>
                    </b-tab-item> -->
                  </b-tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import async from "async";

import Bracket from "../../Brackets.vue";
import playoffs from "../../../assets/playoff.png";
// import eventStats from "../../stats/events/_id";

const moment = require("moment");
export default {
  name: "Event",
  props: {
    type: String
  },
  data() {
    return {
      events: [],
      teamsInvolved: {},
      groups: [],
      column1Teams: [],
      column2Teams: [],
      matches: [],
      finishedMatches: [],
      rounds: [],
      teamMap: {},
      matchMap: {},
      showTwitch: false,
      groupedGroups: [],
      displayedCard: "overview",
      inc: 0,
      tabIndex: 0
    };
  },
  asyncData({ $axios, params }) {
    return $axios
      .get(
        'https://macvars.herokuapp.com/' +
          "api/events/" +
          params.id +
          "/?&populateteams=true&populatematches=true"
      )
      .then(response => {
        return { currentEvent: response.data };
      })
      .catch(err => console.log(err, "error"));
  },
  mounted() {
    this.inc++;
    if (window.location.hash === "") {
      window.location.hash = "#overview";
    } else if (window.location.hash == "#teams") {
      this.tabIndex = 1;
    } else if (window.location.hash == "#groups") {
      this.tabIndex = 2;
    } else if (window.location.hash == "#playoffs") {
      this.tabIndex = 3;
    } else if (window.location.hash == "#matches") {
      this.tabIndex = 4;
    } else if (window.location.hash == "#stats") {
      this.tabIndex = 5;
    } else{
      window.location.hash = "#overview"
    }
    setTimeout(() => {
      this.inc = 5;
    }, 1000);
    for (let i = 0; i < this.currentEvent.teams.length; i++) {
      this.teamsInvolved[
        this.currentEvent.teams[i]._id
      ] = this.currentEvent.teams[i];
    }
    if (this.currentEvent.prizePoolTable !== undefined) {
      for (let i = 0; i < this.currentEvent.prizePoolTable.length; i++)
        if (this.currentEvent.prizePoolTable[i].place !== "3/4") {
          for (let j = 0; j < this.currentEvent.teams.length; j++) {
            if (
              this.currentEvent.prizePoolTable[i].teamId ===
              this.currentEvent.teams[j]._id
            ) {
              this.currentEvent.prizePoolTable[
                i
              ].name = this.currentEvent.teams[j].name;
            }
          }
        } else {
          for (let j = 0; j < this.currentEvent.teams.length; j++) {
            if (
              this.currentEvent.prizePoolTable[i].teamId.split(" ")[0] ===
              this.currentEvent.teams[j]._id
            ) {
              this.currentEvent.prizePoolTable[
                i
              ].name = this.currentEvent.teams[j].name;
            }
          }
          for (let j = 0; j < this.currentEvent.teams.length; j++) {
            if (
              this.currentEvent.prizePoolTable[i].teamId.split(" ")[1] ===
              this.currentEvent.teams[j]._id
            ) {
              this.currentEvent.prizePoolTable[i].name +=
                " " + this.currentEvent.teams[j].name;
            }
          }
          //console.log("name ", this.currentEvent.prizePoolTable[i].name);
        }
    }
    this.organizeGroups();
    // Get Matches

    for (let j = 0; j < this.currentEvent.matches.length; j++) {
      if (this.currentEvent.matches[j].active) {
        this.matches.push(this.currentEvent.matches[j]);
      } else {
        this.finishedMatches.push(this.currentEvent.matches[j]);
      }
    }
    this.finishedMatches.reverse();
    this.matches = this.matches.filter(match => {
      return match.teamsDecided === true;
    });
    this.matches.sort(function(a, b) {
      return new Date(a.dateTime) - new Date(b.dateTime);
    });
    this.finishedMatches.sort(function(a, b) {
      return new Date(b.dateTime) - new Date(a.dateTime);
    });
  },
  methods: {
    changeTab() {
      if(this.tabIndex === 0){
         window.location.hash = "#overview";
      } else if(this.tabIndex === 1){
        window.location.hash = "#teams";
      } else if(this.tabIndex === 2){
        window.location.hash = "#groups";
      } else if(this.tabIndex === 3){
        window.location.hash = "#playoffs";
      } else if(this.tabIndex === 4){
        window.location.hash = "#matches";
      } else if(this.tabIndex === 5){
        window.location.hash = "#stats";
      }
    },
    getStream() {
      return `https://player.twitch.tv/?channel=${this.currentEvent.stream}&parent=hjjhjh.com&muted=true`;
    },
    getImgUrl() {
      return (
        'https://macvars.herokuapp.com/' + `api/uploads/events/${this.currentEvent.img}`
      );
    },
    getTeamImgUrl(teamId) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/teams/${teamId}`;
    },
    getPlayerImgUrl(playerId) {
      return 'https://macvars.herokuapp.com/' + `api/uploads/players/${playerId}`;
    },
    organizeGroups() {
      //console.log(this.currentEvent.groups);
      this.currentEvent.groups.forEach(group => {
        this.groups.push(group);
      });
      for (let i = 0; i < this.groups.length; i++) {
        for (let j = 0; j < this.groups[i].length; j++) {
          this.groups[i][j] = this.teamsInvolved[this.groups[i][j]];
        }
      }

      this.groups.forEach(group => {
        group.sort((team1, team2) => {
          if ((parseInt(team2.eventStats[this.$route.params.id].points) === parseInt(team1.eventStats[this.$route.params.id].points)) && team1.eventStats[this.$route.params.id].groupStageRoundsWon !== undefined) {
            team1.eventStats[this.$route.params.id].teamDiff = team1.eventStats[this.$route.params.id].groupStageRoundsWon - team1.eventStats[this.$route.params.id].groupStageRoundsLost
            team2.eventStats[this.$route.params.id].teamDiff = team2.eventStats[this.$route.params.id].groupStageRoundsWon - team2.eventStats[this.$route.params.id].groupStageRoundsLost
            return (
              team2.eventStats[this.$route.params.id].teamDiff -
              team1.eventStats[this.$route.params.id].teamDiff
            );
          } else {
            return (
            parseInt(team2.eventStats[this.$route.params.id].points) -
            parseInt(team1.eventStats[this.$route.params.id].points)
          );
          }
        });
      });
      this.groups.forEach(group => {
        for (let i = 0; i < this.currentEvent.NofTeamsAdvanceInGroup; i++) {
          group[i].advanced = true;
        }
      });
      this.groups.forEach(group => {
        group.forEach(team => {
          if (!Object.prototype.hasOwnProperty.call(team, "advanced")) {
            team.advanced = false;
          }
        });
      });
      const leftEnd = Math.ceil(this.currentEvent.teams.length / 2);
      this.column1Teams = this.currentEvent.teams.slice(0, leftEnd);
      this.column2Teams = this.currentEvent.teams.slice(leftEnd);
      let currentRun = 0;
      let tempGroup = [];
      for (let i = 0; i < this.currentEvent.teams.length; i++) {
        if (currentRun < 4) {
          tempGroup.push(this.currentEvent.teams[i]);
          currentRun++;
        }
        if (currentRun === 4 && i !== this.currentEvent.teams.length - 1) {
          this.groupedGroups.push(tempGroup);
          currentRun = 0;
          tempGroup = [];
        }
        if (i === this.currentEvent.teams.length - 1) {
          this.groupedGroups.push(tempGroup);
          currentRun = 0;
          tempGroup = [];
        }
      }
      //console.log("grouped", this.groupedGroups);
      // this.organizePlayoffs();
    },
    navTeam(team) {
      if (typeof team === "string") {
        this.$router.push({ path: `/teams/${team}` });
      } else {
        this.$router.push({ path: `/teams/${team.teamId}` });
      }
    },
    navMatch(id, slug) {
      this.$router.push({ path: `/matches/${id}/${slug}` });
    },
    // navEventStat() {
    //   let route = this.$router.resolve({
    //     path: `/stats/events/${this.currentEvent._id}`
    //   });
    //   window.open(route.href, "_blank");
    // },
    getWinnerDetails(match) {
       let maps = match.maps
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
    formatDate(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("DD-MM-YYYY h:mm a");
    },
    isLive(match) {
      if (moment(new Date()).diff(moment(match.dateTime)) <= 0) {
        return false;
      } else {
        return true;
      }
    },
    formatDateEvent(dateTime) {
      const utc = moment.utc(dateTime);
      var localDate = utc.local();
      return moment(localDate).format("MMMM DD, YYYY");
    },
    displayCard(card) {
      this.displayedCard = card;
    },
    navigationFontSize() {
      if (!this.$device.isMobile) {
        return "title";
      }
    },
    getNavigationClass(tab) {
      if (this.displayedCard === tab) {
        return "selected";
      } else {
        return "unSelected";
      }
    },
    getDescriptionWidthClass() {
      if (this.currentEvent.prizePoolTable === undefined) {
        return "column is-full";
      } else {
        return "column is-8";
      }
    },
    getBkg(type) {
      if (type) {
        return "light-bkg";
      } else {
        return "dark-bkg";
      }
    }
  },
  components: { VueMarkdown, Bracket }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$card-content-padding: 0.25rem;
.type-button {
  width: 150px;
}
.button {
  margin-top: 20px;
  margin-bottom: 20px;
}
@media screen and (max-width: 640px) {
  .standings-card {
    margin-left: 5%;
  }
}
.selected {
  color: #bd3734;
}
.unSelected {
  color: #ff726f;
}
.winner {
}
.loser {
  opacity: 0.4;
}
.dark-bkg {
  background-color: #1a212e;
}
.light-bkg {
  background-color: #1a212e;
}
</style>
