const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const { setField } = require('feathers-authentication-hooks');
const verifyHooks = require("feathers-authentication-management").hooks;
const accountService = require("../authManagement/notifier.js");
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const { iff } = require('feathers-hooks-common')
const resendEmail = () => context => { return context.params.headers && context.params.headers['resendemail'] == "true"; };
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [hashPassword('password'), verifyHooks.addVerification()],
    update: [ authenticate('jwt'),setField({
      from: 'params.user._id',
      as: 'params.query._id'
    })],
    patch: [authenticate('jwt'),setField({
      from: 'params.user._id',
      as: 'params.query._id'
    })],
    remove: [authenticate('jwt'),setField({
      from: 'params.user._id',
      as: 'params.query._id'
    }),checkPermissions({
      roles: ['admin']
    })]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [protect('email')],
    get: [protect('email')],
    create: [context => {
      accountService(context.app).notifier('resendVerifySignup', context.result)
    },
    verifyHooks.removeVerification()],
    update: [],
    patch: [iff(resendEmail(), context => {
      accountService(context.app).notifier('resendVerifySignup', context.result)
    })],
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
