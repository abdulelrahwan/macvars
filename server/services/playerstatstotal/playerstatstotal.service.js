// Initializes the `playerstats` service on path `/playerstats`
const createService = require('feathers-mongoose');
const createModel = require('../../models/playerstatstotal.model');
const hooks = require('./playerstatstotal.hooks');
const filters = require('./playerstatstotal.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'playerstatstotal',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/playerstatstotal', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/playerstatstotal');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
