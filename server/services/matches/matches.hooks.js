const { populate, iff } = require('feathers-hooks-common')
const checkPermissions = require('feathers-permissions');
const { authenticate } = require('@feathersjs/authentication').hooks;
const slugify = require('feathers-slugify')
const myHook = require("./hooks")
// const updateComments = require('./updateComment')
const populateComments = () => context => { return context.params.headers && context.params.headers['populatecomments'] == "true"; };
const populateMaps = () => context => { return context.params.headers && context.params.headers['populatemaps'] == "true"; };
const populateMapsOnly = () => context => { return context.params.headers && context.params.headers['populatemapsonly'] == "true"; };
const populateActivePlayers = () => context => { return context.params.headers && context.params.headers['populateactiveplayers'] == "true"; };
const populateMatchPlayers = () => context => { return context.params.headers && context.params.headers['populatematchplayers'] == "true"; };
const dontPopulateActivePlayers = () => context => { return !context.params.headers || context.params.headers['populateactiveplayers'] != "true"; };
// const playerstatstotalHook = require("./playerstatstotalHook")

const matchPlayersSchema = {
  include: {
    service: 'api/players',
    nameAs: 'activePlayers',
    parentField: 'activePlayerIds',
    childField: '_id',
    asArray: true
  }
}

const teamOneSchema = {
  include: {
    service: 'api/teams',
    nameAs: 'teamOne',
    parentField: 'teamOneId',
    childField: '_id'
  }
}

const teamTwoSchema = {
  include: {
    service: 'api/teams',
    nameAs: 'teamTwo',
    parentField: 'teamTwoId',
    childField: '_id'
  }
}

const teamOneSchemaWithPlayers = {
  include: {
    service: 'api/teams',
    nameAs: 'teamOne',
    parentField: 'teamOneId',
    childField: '_id',
    include: [{
      service: 'api/players',
      nameAs: 'activePlayers',
      parentField: 'activePlayerIds',
      childField: '_id',
      asArray: true
    }]
  }
}
const teamTwoSchemaWithPlayers = {
  include: {
    service: 'api/teams',
    nameAs: 'teamTwo',
    parentField: 'teamTwoId',
    childField: '_id',
    include: [{
      service: 'api/players',
      nameAs: 'activePlayers',
      parentField: 'activePlayerIds',
      childField: '_id',
      asArray: true
    }]
  }
}

const mapSchema = {
  include: {
    service: 'api/maps',
    nameAs: 'maps',
    parentField: 'mapIds',
    childField: '_id',
    asArray: true,
    include: [{
      service: 'api/gamemaps',
      nameAs: 'map',
      parentField: 'mapId',
      childField: '_id'
    }, {
      service: 'api/playerstats',
      nameAs: 'playerStats',
      parentField: 'playerStatIds',
      childField: '_id',
      asArray: true,
      include: [{
        service: 'api/agents',
        nameAs: 'agent',
        parentField: 'agentId',
        childField: '_id',
      }]
    }]
  }
}

const mapsOnlySchema = {
  include: {
    service: 'api/maps',
    nameAs: 'maps',
    parentField: 'mapIds',
    childField: '_id',
    asArray: true,
    include: [{
      service: 'api/gamemaps',
      nameAs: 'map',
      parentField: 'mapId',
      childField: '_id'
    }]
  }
}

const commentSchema = {
  include: {
    service: 'api/comments',
    nameAs: 'comments',
    parentField: 'commentIds',
    childField: '_id',
    asArray: true,
    include: [{
      service: 'users',
      nameAs: 'user',
      parentField: 'userId',
      childField: '_id'
    },
    {
      service: 'api/comments',
      nameAs: 'replies',
      parentField: 'repliesId',
      childField: '_id',
      asArray: true,
      include: [{
        service: 'api/comments',
        nameAs: 'replies',
        parentField: 'repliesId',
        childField: '_id',
        asArray: true,
        include: [{
          service: 'api/comments',
          nameAs: 'replies',
          parentField: 'repliesId',
          childField: '_id',
          asArray: true,
          include: [{
            service: 'api/comments',
            nameAs: 'replies',
            parentField: 'repliesId',
            childField: '_id',
            asArray: true,
            include: [{
              service: 'api/comments',
              nameAs: 'replies',
              parentField: 'repliesId',
              childField: '_id',
              asArray: true,
              include: [{
                service: 'api/comments',
                nameAs: 'replies',
                parentField: 'repliesId',
                childField: '_id',
                asArray: true,
                include: [{
                  service: 'api/comments',
                  nameAs: 'replies',
                  parentField: 'repliesId',
                  childField: '_id',
                  asArray: true,
                  include: [{
                    service: 'api/comments',
                    nameAs: 'replies',
                    parentField: 'repliesId',
                    childField: '_id',
                    asArray: true
                  }, {
                    service: 'users',
                    nameAs: 'user',
                    parentField: 'userId',
                    childField: '_id'
                  }]
                },
                {
                  service: 'users',
                  nameAs: 'user',
                  parentField: 'userId',
                  childField: '_id'
                }]
              },
              {
                service: 'users',
                nameAs: 'user',
                parentField: 'userId',
                childField: '_id'
              }]
            },
            {
              service: 'users',
              nameAs: 'user',
              parentField: 'userId',
              childField: '_id'
            }]
          },
          {
            service: 'users',
            nameAs: 'user',
            parentField: 'userId',
            childField: '_id'
          }]
        },
        {
          service: 'users',
          nameAs: 'user',
          parentField: 'userId',
          childField: '_id'
        }]
      },
      {
        service: 'users',
        nameAs: 'user',
        parentField: 'userId',
        childField: '_id'
      }]
    }]
  }
}

const query = {
  $limit: 10,
  $sort: {
    dateTime: -1
  },
  $skip: 0,
  $or: [
    { teamOneId: { $in: [] } },
    { teamTwoId: { $in: [] } }
  ]
}


module.exports = {
  before: {
    all: [myHook()],
    find: [populate({ schema: query })],
    get: [],
    create: [authenticate('jwt'), checkPermissions({
      roles: ['admin']
    }), populate({ schema: teamOneSchema }), populate({ schema: teamTwoSchema }), slugify({ slug: ['teamOne.name', 'teamTwo.name'] })],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt'), checkPermissions({
      roles: ['admin']
    })]
  },

  after: {
    all: [iff(populateMatchPlayers(), populate({ schema: matchPlayersSchema })),iff(populateActivePlayers(), populate({ schema: teamOneSchemaWithPlayers })), iff(populateActivePlayers(), populate({ schema: teamTwoSchemaWithPlayers })), iff(dontPopulateActivePlayers(), populate({ schema: teamOneSchema })), iff(dontPopulateActivePlayers(), populate({ schema: teamTwoSchema })), iff(populateComments(), populate({ schema: commentSchema })), iff(populateMapsOnly(), populate({ schema: mapsOnlySchema })), iff(populateMaps(), populate({ schema: mapSchema }))],
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
