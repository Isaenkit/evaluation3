var express = require ('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controllers.js');


// Hotel routes
router
  .route('/hotel')
  .get(ctrlHotels.hotelsGetAll)

router
  .route('/hotel/:hotelId')
  .get(ctrlHotels.hotelsGetOne)
  .post(ctrlHotels.postAddComment)

module.exports = router;
