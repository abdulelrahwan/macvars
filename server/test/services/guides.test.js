const assert = require('assert');
const app = require('../../src/app');

describe('\'guides\' service', () => {
  it('registered the service', () => {
    const service = app.service('guides');

    assert.ok(service, 'Registered the service');
  });
});
