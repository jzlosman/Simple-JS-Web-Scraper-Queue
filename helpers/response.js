/**
 * Service to handle success and error of website lookup
 * @type {Object}
 */
module.exports = {
  /**
   * responding with a website Object
   * @param  {Object} res     express response
   * @param  {Object} website Website DB entity
   * @return
   */
  success: function(res, website) {
    res.send({
      links: {
        status: `http://127.0.0.1:${process.env.PORT || 8080}/${website.queueId}`
      },
      data: website
    })
  },

  /**
   * responding with an error
   * @param  {Object} res    express response
   * @param  {number} status error status code
   * @param  {Object} error  error object
   * @return
   */
  error: function(res, status, error) {
    res.status(status).send({
      error
    })
  }
}
