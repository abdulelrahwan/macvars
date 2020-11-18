const { populate, iff } = require('feathers-hooks-common')
const myHook = require("./hooks")
const popHook = require("./pophooks")
const populateMatch = () => context => { return context.params.headers && context.params.headers['populatematch'] == "true"; };
const populateEvent = () => context => { return context.params.headers && context.params.headers['populateevent'] == "true"; };
const populatePlayer = () => context => { return context.params.headers && context.params.headers['populateplayer'] == "true"; };
const populateAgent = () => context => { return context.params.headers && context.params.headers['populateagent'] == "true"; };
const populateMap = () => context => { return context.params.headers && context.params.headers['populatemap'] == "true"; };
const checkPermissions = require('feathers-permissions');
const { authenticate } = require('@feathersjs/authentication').hooks;

const query = {
  $limit: 10,
  $sort: {
    createdAt: -1
  },
  $skip: 0
}

const matchSchema = {
  include: {
    service: 'api/matches',
    nameAs: 'match',
    parentField: 'matchId',
    childField: '_id',
    include: [
      {
        service: 'api/teams',
        nameAs: 'teamOne',
        parentField: 'teamOneId',
        childField: '_id'
      },
      {
        service: 'api/teams',
        nameAs: 'teamTwo',
        parentField: 'teamTwoId',
        childField: '_id'
      }
    ]
  }
}
const eventSchema = {
  include: {
    service: 'api/events',
    nameAs: 'event',
    parentField: 'eventId',
    childField: '_id'
  }
}
const playerSchema = {
  include: {
    service: 'api/players',
    nameAs: 'player',
    parentField: 'playerId',
    childField: '_id'
  }
}
const agentSchema = {
  include: {
    service: 'api/agents',
    nameAs: 'agent',
    parentField: 'agentId',
    childField: '_id'
  }
}
const mapSchema = {
  include: {
    service: 'api/maps',
    nameAs: 'map',
    parentField: 'mapId',
    childField: '_id'
  }
}

module.exports = {
  before: {
    all: [popHook()],
    find: [],
    get: [],
    create: [myHook(), authenticate('jwt'),checkPermissions({
      roles: ['admin']
    })],
    update: [myHook(), authenticate('jwt'),checkPermissions({
      roles: ['admin']
    })],
    patch: [myHook(), authenticate('jwt'),checkPermissions({
      roles: ['admin']
    })],
    remove: [myHook(), authenticate('jwt'),checkPermissions({
      roles: ['admin']
    })]
  },

  after: {
    all: [],
    find: [iff(populateMatch(), populate({ schema: matchSchema })), iff(populateEvent(), populate({ schema: eventSchema })), iff(populatePlayer(), populate({ schema: playerSchema })), iff(populateAgent(), populate({ schema: agentSchema })), iff(populateMap(), populate({ schema: mapSchema }))],
    get: [iff(populateMatch(), populate({ schema: matchSchema })), iff(populateEvent(), populate({ schema: eventSchema })), iff(populatePlayer(), populate({ schema: playerSchema })), iff(populateAgent(), populate({ schema: agentSchema })), iff(populateMap(), populate({ schema: mapSchema }))],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
