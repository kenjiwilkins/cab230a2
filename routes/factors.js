var express = require('express');
var router = express.Router();
const factorsFormatter = require('../utilities/formatters').formatFactors;

router.get("/:year", (req, res) => {
  let yearPattern = /^\d{4}$/g
  let countryPattern = "[0-9]"
  if(Object.entries(req.query).length !== 0 && (!req.query.limit && !req.query.country)){
    return res.status(400).json({
      error:true,
      message:`Invalid query parameters: ${Object.keys(req.query)}. Only year and country are permitted.`
    })
  }
  if(!req.params.year.match(yearPattern)){
    return res.status(400).json({
      "error": true,
      "message": "Invalid year format. Format must be yyyy."
    })
  }
  if(req.query.limit){
    if(isNaN(req.query.limit)){
      return res.status(400).json({
        "error": true,
        "message": "Invalid year format. Format must be yyyy."
      })
    } else {
      if(parseFloat(req.query.limit) % 1 !== 0){
        return res.status(400).json({
          "error": true,
          "message": "Invalid year format. Format must be yyyy."
        })
      }
    }
  }
  if(req.query.country){
    if(req.query.country.match(countryPattern)){
      return res.status(400).json({
        error:true,
        message:"Invalid country format. Country query parameter cannot contain numbers."
      })
    }
  }
  if(req.query.limit && !req.query.country){
    req.db.from("rankings").where({year:req.params.year}).limit(req.query.limit).then((rows) => {
      return res.status(200).send(factorsFormatter(rows))
    })
  } else if(!req.query.limit && req.query.country){
    req.db.from("rankings").where({year:req.params.year, country:req.query.country}).then((rows) => {
      return res.status(200).send(factorsFormatter(rows))
    })
  } else if (req.query.limit && req.query.country){
    req.db.from("rankings").where({year:req.params.year, country:req.query.country}).limit(req.query.limit).then((rows) => {
      return res.status(200).send(factorsFormatter(rows))
    })
  } else {
    req.db.from("rankings").where({year:req.params.year}).then((rows) => {
      return res.status(200).send(factorsFormatter(rows))
    })
  }
})

module.exports = router;