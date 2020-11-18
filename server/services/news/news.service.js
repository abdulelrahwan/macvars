// Initializes the `news` service on path `/news`
const { News } = require('./news.class');
const createModel = require('../../models/news.model');
const hooks = require('./news.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/api/news',new News(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/news');

  service.hooks(hooks);
};
