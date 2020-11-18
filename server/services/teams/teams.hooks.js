const { populate } = require('feathers-hooks-common')
const checkPermissions = require('feathers-permissions');
const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-mongodb-fuzzy-search')
const query = {
  $search: 'cat'
}

const activePlayersSchema = {
  include: {
    service: 'api/players',
    nameAs: 'activePlayers',
    parentField: 'activePlayerIds',
    childField: '_id',
    asArray: true
  }
}
const allPlayersSchema = {
  include: {
    service: 'api/players',
    nameAs: 'players',
    parentField: 'playerIds',
    childField: '_id',
    asArray: true
  }
}

module.exports = {
  before: {
    all: [populate({ schema: query }),search({fields:['name']})],
    find: [],
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
    all: [populate({ schema: activePlayersSchema }), populate({ schema: allPlayersSchema })],
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
