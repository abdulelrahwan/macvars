// Initializes the `eventstats` service on path `/api/eventstats`
const createService = require('feathers-mongoose');
const createModel = require('../../models/eventstats.model');
const hooks = require('./eventstats.hooks');
const filters = require('./eventstats.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'eventstats',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/eventstats', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/eventstats');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
