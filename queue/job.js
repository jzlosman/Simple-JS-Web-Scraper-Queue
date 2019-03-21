/* webscraper */
const axios = require('axios');
const db = require('./../db/db');

const axiosConfig = {
  maxContentLength: 2000000, /* ~2MB in bytes */
  timeout: 2000              /* 2 sec in ms */
}

/**
 * process queue item, scraping the website and storing the result
 * @param  {string} queueId
 * @param  {string} url
 * @return
 */
const process = (queueId, url) => {
  return scrape(url).then((html) => {
    return db.update({
      queueId,
      html,
      error: null
    });
  }).catch((err) => {
    return db.update({
      queueId,
      html: null,
      error: err.message
    });
  });
}

/**
 * scrape a URL and return a promise which contains the raw HTML
 * @param  {string} url
 * @return {Promise}
 */
const scrape = (url) => {
  return axios.get(url, axiosConfig).then((result) => {return result.data})
}

module.exports = {
  process
}
