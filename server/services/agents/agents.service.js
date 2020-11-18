// Initializes the `agents` service on path `/api/agents`
const createService = require('feathers-mongoose');
const createModel = require('../../models/agents.model');
const hooks = require('./agents.hooks');
const filters = require('./agents.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'agents',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/agents', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/agents');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
