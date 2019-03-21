const nock = require('nock');
const {assert} = require('chai');

const db = require('./../../db/db');
const job = require('../../queue/job');

describe("Web Scraper", async () => {
  it("fetches a URL and stores result in database", async () => {
    const queueId = 'A'
    const url = 'https://google.com'
    const website = db.create(queueId, url);
    const html = '<html><body>Test</body></html>';

    //mock url response (intercept url call)
    const mockScrape = nock(url).get('/').reply(200, html);

    await job.process(queueId, url).then( (result) => {
      assert.isObject(result);
      assert.equal(result.queueId, queueId);
      assert.isNull(result.error);
      assert.equal(result.html, html);
    });
  });

  it("fails gracefully if content is larger than 2MB", async () => {
    const queueId = 'B';
    const url = 'http://ipv4.download.thinkbroadband.com/5MB.zip';
    const website = db.create(queueId, url);

    await job.process(queueId, url).then( (result) => {
      assert.isObject(result);
      assert.equal(result.queueId, queueId);
      assert.isNull(result.html);
      assert.match(result.error, /^maxContentLength/, 'error message is not expected.')
    });
  }).timeout(4000)
});
