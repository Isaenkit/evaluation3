angular.module('hobookhotel').controller('HotelAddController', HotelAddController);

function HotelAddController($location, hotelDataFactory) {
  var vm = this;
  vm.isSubmitted = false;

  vm.addHotel = function() {
    var postData = {
      name : vm.name,
      description : vm.description,
      stars : vm.stars,
    };
    if (vm.reviewForm.$valid) {
      hotelDataFactory.postHotel(postData).then(function(response) {
        if(response.status === 201) {
          $location.path('/');
        }
      }).catch(function(error) {
        console.log(error);
      });
    } else {
      vm.isSubmitted = true;
    }
  };
}
