const assert = require('assert');
const app = require('../../src/app');

describe('\'gamemaps\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/gamemaps');

    assert.ok(service, 'Registered the service');
  });
});
