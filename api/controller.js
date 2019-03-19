const imqueue = require('in-memory-queue');
const urlParser = require('url');
const validator = require('validator');

const db = require('../db/db');
const response = require('../helpers/response');

/**
 * handle post request, returning cached result or adding to process queueId
 * @param  {Object} req express request
 * @param  {Object} res express response
 * @return {[type]}     [description]
 */
const create = (req, res) => {
  const body = req.body;
  const url = validateUrl(body, res);

  const existingWebsite = db.findByUrl(url);
  if(existingWebsite !== null) {
    return response.success(res, existingWebsite);
  }
  addToQueue(url, req, res);
}

/**
 * validate the URL and return a formatted URL for consistency
 * @param  {Object} body post body containing url param
 * @param  {Object} res  express response
 * @return {string}      formatted url if no errors thrown
 */
const validateUrl = (body, res) => {
   if(!body.hasOwnProperty('url') || !validator.isURL(body.url)) {
     response.error(res, 422, "Request must contain a url property with a valid URL");
   }
   let urlObj = urlParser.parse(body.url);
   if(urlObj.protocol === null) {
     response.error(res, 422, 'URL must contain a protocol (http:// or https://)')
   }
   return urlParser.format(urlObj);
}

/**
 * add website lookup to queue
 * @param {string} url website
 * @param {Object} req express request
 * @param {Object} res express response
 */
const addToQueue = (url, req, res) => {
  imqueue.createMessage(process.env.TOPIC, JSON.stringify({ url })).then(({ message }) => {
    const id = message.getId();
    website = db.create(id, url);
    response.success(res, website);
  }).catch( (err) => {
    response.error(res, 500, err);
  })
}

/**
 * lookup status of queue item based on queueId
 * @param {Object} req express request
 * @param {Object} res express response
 * @return
 */
const status = (req, res) => {
  const queueId = req.params.queue_id;
  website = db.find(queueId);
  if(website !== null) {
    response.success(res, website);
  }
  response.error(res, 404, 'Queue ID not found');
}

/**
 * exposing endpoints
 * @type {Object}
 */
module.exports  = {
  create,
  status
}
