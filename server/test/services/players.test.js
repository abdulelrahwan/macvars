const assert = require('assert');
const app = require('../../src/app');

describe('\'players\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/players');

    assert.ok(service, 'Registered the service');
  });
});
