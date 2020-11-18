
const checkPermissions = require('feathers-permissions');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-hooks-common')
const search = require('feathers-mongodb-fuzzy-search')
const slugify = require('feathers-slugify')

const query = {
  $search: 'cat'
}

module.exports = {
  before: {
    all: [populate({ schema: query }),search({fields:['name']})],
    get: [],
    create: [authenticate('jwt'),checkPermissions({
      roles: ['admin']
    }), slugify({ slug: ['name'] })],
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
