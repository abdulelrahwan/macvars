// Initializes the `playerstats` service on path `/playerstats`
const createService = require('feathers-mongoose');
const createModel = require('../../models/playerstats.model');
const hooks = require('./playerstats.hooks');
const filters = require('./playerstats.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'playerstats',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/playerstats', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/playerstats');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
