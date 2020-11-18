

const checkPermissions = require('feathers-permissions');
const { authenticate } = require('@feathersjs/authentication').hooks;

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
