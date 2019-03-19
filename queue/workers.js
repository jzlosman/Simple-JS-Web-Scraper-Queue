/**
 * based on sample code from https://www.npmjs.com/package/in-memory-queue
 */
const imqueue = require('in-memory-queue');
const Promise = require('bluebird');

const job = require('./job');

const createWorker = (topic) => {
  return imqueue.createConsumer(topic, 1, function (msg) {
      const url = JSON.parse(msg.getValue()).url;
      job.process(msg.getId(), url);

      return Promise.resolve();
  });
}

module.exports = {
  createWorker
}
