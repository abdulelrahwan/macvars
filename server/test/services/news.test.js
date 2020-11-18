const assert = require('assert');
const app = require('../../src/app');

describe('\'news\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/news');

    assert.ok(service, 'Registered the service');
  });
});
