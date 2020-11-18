// Initializes the `gamemaps` service on path `/api/gamemaps`
const createService = require('feathers-mongoose');
const createModel = require('../../models/gamemaps.model');
const hooks = require('./gamemaps.hooks');
const filters = require('./gamemaps.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gamemaps',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/gamemaps', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/gamemaps');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
