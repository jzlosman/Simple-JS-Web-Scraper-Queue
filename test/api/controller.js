const {assert} = require('chai');
const { mockRequest, mockResponse } = require('mock-req-res');
const controller = require('./../../api/controller');

describe("API", () => {
  describe("POST", () => {
    it('throws error when no protocol is included', async ()=> {
      const req = mockRequest({
        body: {
          url: 'www.google.com'
        }
      });
      const res = mockResponse();
      await controller.create(req, res);
      assert.equal(res.status.calledWith(422), true, 'should be 422 invalid request');
    });

    it('throws error when url is not valid', async ()=> {
      const req = mockRequest({
        body: {
          url: 'google'
        }
      });
      const res = mockResponse();
      await controller.create(req, res);
      assert.equal(res.status.calledWith(422), true, 'should be 422 invalid request');
    });
  });
});
