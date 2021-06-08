var express = require('express');
var router = express.Router();
const rankingFormatter = require("../utilities/formatters").formatRankings;
const rankingQuery = require('../utilities/dbqueries').queryForRankings;

router.get('/', (req, res) => {
  let pattern = "[0-9]"
  let yearPattern = /^\d{4}$/g
  if(Object.entries(req.query).length !== 0 && (!req.query.year && !req.query.country)){
    return res.status(400).json({
      error:true,
      message:`Invalid query parameters: ${Object.keys(req.query)}. Only year and country are permitted.`
    })
  }
  if(req.query.country){
    if(req.query.country.match(pattern)){
      return res.status(400).json({
        error:true,
        message:"Invalid country format. Country query parameter cannot contain numbers."
      })
    }
  }
  if(req.query.year){
    if(!req.query.year.match(yearPattern)){
      return res.status(400).json({
        error:true,
        message: "Invalid year format. Format must be yyyy."
      })
    }
  }
  const query = req.query.map(q => {
    return {}
  })
  req.db.raw(rankingQuery(req.query)).then(rankings => {
    return res.status(200).send(rankingFormatter(rankings));
  }).catch(err => {
    if(err){
      console.log(err);
    }
  })
});


module.exports = router;