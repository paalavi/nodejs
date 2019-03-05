const express = require('express');
let router = express.Router();

router.get('/api',function (req,res) {
  res.json({message:"API CONTROLER"})
});

module.exports = router;