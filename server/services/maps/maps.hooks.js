const { populate, iff } = require('feathers-hooks-common')
const populateGameMap = () => context => { return context.params.headers && context.params.headers['populategamemap'] == "true"; };
const checkPermissions = require('feathers-permissions');
const { authenticate } = require('@feathersjs/authentication').hooks;
const gamemapSchema = {
  include: {
    service: 'api/gamemaps',
    nameAs: 'map',
    parentField: 'mapId',
    childField: '_id'
  }
}

module.exports = {
  before: {
    all: [],
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
    all: [iff(populateGameMap(), populate({ schema: gamemapSchema }))],
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
