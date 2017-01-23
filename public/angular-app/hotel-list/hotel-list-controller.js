angular.module('hobookhotel').controller('HotelsController', HotelsController);

function HotelsController(hotelDataFactory) {
  var vm = this;
  vm.title = 'Liste des hotels';
  hotelDataFactory.hotelList().then(function(response){
    console.log(response);
    vm.hotels = response.data;
  });
}
