const assert = require('assert');
const app = require('../../src/app');

describe('\'eventstats\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/eventstats');

    assert.ok(service, 'Registered the service');
  });
});
