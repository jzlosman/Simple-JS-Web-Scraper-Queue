require('dotenv').config();
const imqueue = require('in-memory-queue');
const Promise = require('bluebird');

const topics = [];
const workers = require('./workers');

const configQueue = (topic) => {
  imqueue.setQueueConfiguration(100, 2);
  return imqueue.createTopic(topic).then( (result) => {
    if(result.topic === topic && result.success) {
      topics.push(topic);
    }
    return result;
  })
}

const startWorker = (topic) => {
  if(topics.indexOf(topic) >= 0) {
    return workers.createWorker(topic);
  }
  throw `${topic} queue not created`;
}

module.exports = {
  configQueue,
  startWorker
}
