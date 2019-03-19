let router = require('express').Router();
const controller = require('./controller');
router.post('/', controller.create);

router.route('/:queue_id').get(controller.status);

module.exports = router;
