const { populate } = require('feathers-hooks-common')
const checkPermissions = require('feathers-permissions');
const myHook = require("./beforehook")
const { authenticate } = require('@feathersjs/authentication').hooks;
const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
}

const repliesSchema = {
  include: {
    service: 'api/comments',
    nameAs: 'replies',
    parentField: 'repliesId',
    select: (hook, parent, depth) => ({ $limit: 6 }),
    childField: '_id'
  }
}
const query = {
  $limit: 10,
  $sort: {
    updatedAt: -1
  },
  $skip: 0
}
module.exports = {
  before: {
    all: [],
    find: [populate({ schema: query })],
    get: [],
    create: [myHook(),authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt'),checkPermissions({
      roles: ['admin', 'moderator']
    })]
  },

  after: {
    all: [populate({ schema: userSchema }),populate({ schema: repliesSchema })],
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
