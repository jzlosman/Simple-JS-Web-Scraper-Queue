/* in-memory DB - can be persisted to file with saveDatabase() method */
const Loki = require('lokijs');
const db = new Loki('db/db.json');
const websites = db.addCollection('websites');

/**
 * store HTML in DB
 * @param  {string} queueId
 * @param {string} url
 * @return {bool}
 */
const create = (queueId, url) => {
  return websites.insert({
    queueId,
    url,
    processed: false,
    hasError: null,
    html: null,
  });
}

/**
 * update website lookup with html
 * @param  {string} queueId
 * @param  {string} html
 * @param  {bool} hasError  encountered error during scrape
 * @return
 */
const update = ({ queueId, html, hasError }) => {
  website = find(queueId);
  if (website !== null) {
    website.html = html;
    website.processed = true;
    website.hasError = hasError;
    websites.update(website);
  }
}

/**
 * find website by queueId
 * @param  {string} queueId
 * @return {Object|null} website content
 */
const find = (queueId) => {
  return findByProp({ queueId });
}

/**
 * find website by url
 * @param  {string} url
 * @return {Object|null} website content
 */
const findByUrl = (url) => {
  return findByProp({ url });
}

/**
 * utility to find by any prop and return first result
 * @param  {Object} prop property to search on (should be unique)
 * @return {Object|null}
 */
const findByProp = (prop) => {
  const results = websites.find(prop);
  if (results.length > 0) {
    return results[0];
  }
  return null;
}

module.exports = {
  create,
  update,
  find,
  findByUrl
}
