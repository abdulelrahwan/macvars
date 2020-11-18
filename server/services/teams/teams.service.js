// Initializes the `teams` service on path `/teams`
const { Teams } = require('./teams.class');
const createModel = require('../../models/teams.model');
const hooks = require('./teams.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$populate', '$regex'],
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/api/teams',new Teams(options, app));


  // Get our initialized service so that we can register hooks
  const service = app.service('api/teams');

  service.hooks(hooks);
};
