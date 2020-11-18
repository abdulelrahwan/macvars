const { populate, iff } = require('feathers-hooks-common')
const myHook = require("./hooks")
const checkPermissions = require('feathers-permissions');
const { authenticate } = require('@feathersjs/authentication').hooks;
const populateTeams = () => context => { return context.params.headers && context.params.headers['populateteams'] == "true"; };
const populateMatches = () => context => { return context.params.headers && context.params.headers['populatematches'] == "true"; };
const slugify = require('feathers-slugify')

const teamsSchema = {
  include: {
    service: 'api/teams',
    nameAs: 'teams',
    parentField: 'teamIds',
    childField: '_id',
    asArray: true,
    include: [{
      service: 'api/players',
      nameAs: 'players',
      parentField: 'playerIds',
      childField: '_id',
      asArray: true
    }]
  }
}
const matchSchema = {
  include: {
    service: 'api/matches',
    nameAs: 'matches',
    parentField: 'matchIds',
    childField: '_id',
    asArray: true,
    include: [{
      service: 'api/teams',
      nameAs: 'teamOne',
      parentField: 'teamOneId',
      childField: '_id'
    }, {
      service: 'api/teams',
      nameAs: 'teamTwo',
      parentField: 'teamTwoId',
      childField: '_id'
    }, {
      service: 'api/maps',
      nameAs: 'maps',
      parentField: 'mapIds',
      childField: '_id',
      asArray: true,
    }]
  }
}

const query = {
  $limit: 10,
  $sort: {
    createdAt: -1
  },
  $skip: 0
}

module.exports = {
  before: {
    all: [myHook(),populate({ schema: query })],
    find: [],
    get: [],
    create: [authenticate('jwt'),checkPermissions({
      roles: ['admin']
    }),slugify({ slug: 'name' })],
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
    all: [iff(populateTeams(), populate({ schema: teamsSchema })), iff(populateMatches(), populate({ schema: matchSchema }))],
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
