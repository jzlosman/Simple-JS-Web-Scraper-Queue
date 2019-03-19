/* webscraper */
const axios = require('axios');
const db = require('./../db/db');

/**
 * process queue item, scraping the website and storing the result
 * @param  {string} queueId
 * @param  {string} url
 * @return
 */
const process = (queueId, url) => {
  scrape(url).then((html) => {
    db.update({ queueId, html, hasError: false });
  }).catch((err) => {
    db.update({queueId, html: 'Unable to get HTML from the URL provided', hasError: true });
  });
}

/**
 * scrape a URL and return a promise which contains the raw HTML
 * @param  {string} url
 * @return {Promise}
 */
const scrape = (url) => {
  return axios.get(url).then((result) => {return result.data})
}

module.exports = {
  process
}
