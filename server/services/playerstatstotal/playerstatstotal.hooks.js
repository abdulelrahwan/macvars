const { populate, iff } = require('feathers-hooks-common')
const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const populatePlayer = () => context => { return context.params.headers && context.params.headers['populateplayer'] == "true"; };
const myHook = require("./hook")

const query = {
  $limit: 10,
  $sort: {
    "matchHistory.avgCombatScore": -1,
    "matchHistory.kills": -1,
    "matchHistory.assists": -1,
    "matchHistory.rating": -1
  },
  $skip: 0
}
const playerSchema = {
  include: {
    service: 'api/players',
    nameAs: 'player',
    parentField: 'playerId',
    childField: '_id'
  }
}

module.exports = {
  before: {
    all: [myHook()],
    find: [populate({ schema: query })],
    get: [],
    create: [authenticate('jwt'),checkPermissions({
      roles: ['admin']
    })],
    update: [authenticate('jwt'),checkPermissions({
      roles: ['admin']
    })],
    patch: [authenticate('jwt'),checkPermissions({
      roles: ['admin']
    })],
    remove: [authenticate('jwt'),checkPermissions({
      roles: ['admin']
    })]
  },

  after: {
    all: [iff(populatePlayer(), populate({ schema: playerSchema }))],
    find: [],
    get: [],
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
