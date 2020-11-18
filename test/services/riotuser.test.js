const assert = require('assert');
const app = require('../../server/app');

describe('\'riotuser\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/riotuser');

    assert.ok(service, 'Registered the service');
  });
});
