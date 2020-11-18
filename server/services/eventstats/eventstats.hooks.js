
const { populate, iff } = require('feathers-hooks-common')
const myHook = require("./hooks")
const newHook = require('./newhook')
const checkPermissions = require('feathers-permissions');
const { authenticate } = require('@feathersjs/authentication').hooks;
const updateStats = () => context => {;return context.params.headers && context.params.headers['shouldupdate'] == 'true'; };


module.exports = {
  before: {
    all: [newHook()],
    find: [iff(updateStats(), myHook())],
    get: [iff(updateStats(), myHook())],
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
    all: [],
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
