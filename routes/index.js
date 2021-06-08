var express = require('express');
var router = express.Router();
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
// swaggerUI.setup(swaggerDocument)
router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(swaggerDocument))

module.exports = router;
