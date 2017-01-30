var mongoose = require('mongoose');
var Hotel = mongoose.model('hotel');

module.exports.hotelsGetAll = (req, res) => {
    Hotel
      .find()
      .exec(function(err, hotels) {
        console.log(err);
        console.log(hotels);
        if (err) {
          console.log("Error finding hotels");
          res
            .status(500)
            .json(err);
        } else {
          console.log("Found hotels");
          res
            .json(hotels);
        }
      });
  };

  module.exports.hotelsGetOne = (req, res) => {
    var hotelId = req.params.hotelId;

    console.log('Get hotelId', id);

    Hotel
      .findById(hotelId)
      .exec(function(err, hotel) {
        if (err) {
          console.log("Error finding hotel");
          res
            .status(500)
            .json(err);
        } else {
          console.log("Finding hotel");
            res
              .json(hotel)
        }
      });
  };

  module.exports.postAddComment = (req, res) => {
    var hotelId = req.params.hotelId;

    Hotel
      .findById(hotelId)
      .select('reviews')
      .exec(function(err, hotel){
        if(err) {
          console.log('Error finding hotel');
          res
            .status(500)
            .json(err);
        } else if (!hotel) {
          console.log('Error finding hotel');
          res
            .status(404)
            .json({"message" : "Error finding hotel"});
        } else {
          hotel.reviews.push({
            name : req.body.name,
            rating : parseInt(req.body.rating, 10),
            review : req.body.commentaire
          });
          hotel.save(function(err, hotelUpdated) {
            if (err) {
              res
                .status(500)
                .json(err);
            } else {
              res
                .status(200)
                .json(hotelUpdated.reviews[hotelUpdated.reviews.length-1]);
            }
          });
        }
      });
  };
