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

router.get('/knex', (req, res, next) => {
  req.db.raw("SELECT * from city").then(
    (version) => console.log((version[0][0]))
  ).catch(err => {
    if(err){console.log(err); throw error}
  })
  res.send("version logged successfully");
})

module.exports = router;
