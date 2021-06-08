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
  if(req.query.year && !req.query.country){
    req.db.from("rankings").where({year:req.query.year}).then((rows) => {
      return res.status(200).send(rankingFormatter(rows))
    })
  } else if(!req.query.year && req.query.country){
    req.db.from("rankings").where({country:req.query.country}).then((rows) => {
      return res.status(200).send(rankingFormatter(rows))
    })
  } else if (req.query.year && req.query.country){
    req.db.from("rankings").where({year:req.query.year, country:req.query.country}).then((rows) => {
      return res.status(200).send(rankingFormatter(rows))
    })
  } else {
    req.db.from("rankings").select('*').then((rows) => {
      return res.status(200).send(rankingFormatter(rows))
    })
  }
});


module.exports = router;