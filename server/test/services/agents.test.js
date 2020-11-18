const assert = require('assert');
const app = require('../../src/app');

describe('\'agents\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/agents');

    assert.ok(service, 'Registered the service');
  });
});
