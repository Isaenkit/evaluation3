var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.hotelsGetAll = (req, res) => {
    console.log('Requested by: '+ req.user);
    console.log('GET the hotels');
    console.log(req.query);

    var offset = 0;
    var count = 5;
    var maxCount =50;

    if (count > maxCount) {
      res
        .status(400)
        .json({
          "message" : "Count limit of " + maxCount + " exceeded"
        });
      return;
    }

    Hotel
      .find()
      .skip(offset)
      .limit(count)
      .exec(function(err, hotels) {
        console.log(err);
        console.log(hotels);
        if (err) {
          console.log("Error finding hotels");
          res
            .status(500)
            .json(err);
        } else {
          console.log("Found hotels", hotels.length);
          res
            .json(hotels);
        }
      });
  };

  module.exports.hotelsGetOne = (req, res) => {
    var id = req.params.hotelId;

    console.log('Get hotelId', id);

    Hotel
      .findById(id)
      .exec(function(err, doc) {
        var response = {
          status : 200,
          message : doc
        };
        if (err) {
          console.log("Error finding hotel");
          response.status = 500;
          response.message = err;
        } else if (!doc) {
          console.log("HotelId not found in database", id);
          response.status = 404;
          response.message = {
            "message" : "Hotel ID not found " + id };
        }
        res
          .status(response.status)
          .json(response.message)
      });
  };

  var _splitArray = function(input) {
    var output;
    if(input && input.length > 0) {
      output = input.split(";");
    } else {
      output = [];
    }
    return output;
  };

  module.exports.hotelsAddOne = (req, res) => {
    console.log("Post new hotel");

    Hotel
      .create({
        name : req.body.name,
        description : req.body.description,
        stars : parseInt(req.body.stars,10),
        photos : _splitArray(req.body.photos),
        currency : req.body.currency,
      }, function(err, hotel) {
        if (err) {
          console.log("Error creating hotel");
          res
            .status(400)
            .json(err);
        } else {
          console.log("Hotel created!", hotel);
          res
            .status(201)
            .json(hotel);
        }
      });
  };

  module.exports.hotelsUpdateOne = (req, res) => {
    var hotelId = req.params.hotelId;

    console.log('Get hotelId', hotelId);

    Hotel
      .findById(hotelId)
      .selec('-reviews -rooms')
      .exec(function(err, hotel) {
        if (err) {
          console.log("Error finding hotel");
          res
            .status(500)
            .json(err);
            return;
        } else if (!hotel) {
          console.log("HotelId not found in database", hotelId);
          res
            .status(404)
            .lson({
              "message" : "Hotel Id not found " + hotelId
            });
            return;
        }

        hotel.name = req.body.name;
        hotel.description = req.body.description;
        hotel.stars = parseInt(req.body.stars,10);
        hotel.photos = _splitArray(req.body.photos);

        hotel
          .save(function(err, hotelUpdated) {
            if (err) {
              res
                .status(500)
                .json(err);
            } else {
              res
                .status(204)
                .json();
            }
          });
      });
  };
