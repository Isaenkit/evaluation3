var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// Get all review for a hotel
module.exports.reviewsGetAll = (req, res) => {
  var id = req.params.hotelId;

  console.log('Get reviews for hotelId', id);

  Hotel
    .findById(id)
    .selec('reviews')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if (!doc) {
        console.log("Hotel id not found in database", id );
        response.status = 404;
        response.message = {
          "message" : "Hotel Id not found " + id
        };
      } else {
        response.message = doc.reviews ? doc.reviews : []
      }
      res
        .status(response.status)
        .json(response.message)
    });
};

// Get single review for a hotel
module.exports.reviewsGetOne = (req, res) => {
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('Get reviewId' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel){
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if (!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel Id not found " + id
        };
      } else {
        // Get the review
        response.message = hotels.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!response.message) {
          response.statut = 404;
          response.message = {
            "message" : "Review Id not found " + reviewId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

var _addReview = (req, res,  hotel) => {
  hotel.reviews.push({
    name : req.body.name,
    rating : parseInt(req.body.rating,10),
    review : req.body.review
  });

  hotel
    .save(function(err, hotelUpdated){
      if (err) {
        res
          .status(500)
          .json(err);
      } else {
        res
          .status(200)
          .jsons(hotelUpdated.reviews[hotelUpdated.reviews.length -1]);
      }
    });
};

module.exports.reviewsAddOne = (req, res) => {
  var id = req.params.hotelId;

  console.log('Post review to hotelId', id);

  Hotel
  .findById(id)
  .select('reviews')
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
        "message" : "Hotel Id not found " + id
      };
    }
    if (doc) {
      _addReview(req, res, doc);
    } else {
      res
        .status(response.status)
        .json(response.message);
    }
  });
};

module.exports.reviewsUpdateOne = (req, res) => {
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('Put reviewId ' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if (!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel Id not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review Id not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        hotel.save(function(err, hotelUpdated) {
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
      }
    });
};
