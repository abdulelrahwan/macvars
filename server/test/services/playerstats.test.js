const assert = require('assert');
const app = require('../../src/app');

describe('\'playerstats\' service', () => {
  it('registered the service', () => {
    const service = app.service('playerstats');

    assert.ok(service, 'Registered the service');
  });
});
