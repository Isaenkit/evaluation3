(function(){
  var app = angular.module('hobookhotel', ['ngRoute']);

  // Directives

  app.directive('header', function(){
    return {
      restrict : 'A',
      templateUrl : '/angular-app/partials/common/header.html'
    }
  });

  app.directive('headerconnect', function(){
    return {
      restrict : 'A',
      templateUrl : '/angular-app/partials/common/headerconnect.html'
    }
  });

  app.directive('footer', function(){
    return {
      restrict : 'A',
      templateUrl : '/angular-app/partials/common/footer.html'
    }
  });

  // Controllers
  app.controller('accueilController', function(hotelDataFactory, $location){
    this.errorLogin = false;

    let paramsObject = {};
    window.location.search.replace(/\?/,'').split('&').map(function(o){ paramsObject[o.split('=')[0]]= o.split('=')[1]});
  
    if(paramsObject.error == "email") {
      this.errorLogin = true;
    }

    this.login = function(form) {
      var connexion = {
        email : form.email,
        password : form.password
      };

      hotelDataFactory.connexion(connexion).then((response) => {
        console.log(response.data);
      });
    }
  });

  app.controller('homeController', function(hotelDataFactory){
    this.hotels = [];
    hotelDataFactory.hotelsGetAll().then((response) => {
      console.log(response);
      this.hotels = response.data;
    });
  });

  app.controller('hotelController', function(hotelDataFactory, $routeParams) {
    var hotelId = $routeParams.hotelId;
    this.hotel = {};

    hotelDataFactory.hotelsGetOne(hotelId).then((response) => {
      console.log(response.data);
      this.hotel = response.data;
    });
    this.addComment = function(form) {
      var comment = {
        name : form.name,
        rating : parseInt(form.rating, 10),
        review : form.comment
      }

      hotelDataFactory.postAddComment(hotelId, comment).then((response) => {
        this.hotel.reviews.push(response.data);
      });
    }
  });

  // Routage
  app.config(['$routeProvider', function($routeProvider) {

    $routeProvider
    .when('/', {
      templateUrl: 'angular-app/partials/home.html',
      controller: 'homeController',
      controllerAs: 'homeCtrl'
    })
    .when('/hotel/:hotelId', {
      templateUrl: 'angular-app/partials/hotel.html',
      controller: 'hotelController',
      controllerAs: 'hotelCtrl'
    })
    .otherwise({
      redirectTo:'/'
    })
}]);

  // Service pour les hotels
  app.factory('hotelDataFactory', function($http){
    return {
      hotelsGetAll : hotelsGetAll,
      hotelsGetOne : hotelsGetOne,
      postAddComment : postAddComment,
      connexion : connexion
    };
    function hotelsGetAll() {
      return $http.get('/api/hotel').then(complete).catch(failed);
    }
    function hotelsGetOne(hotelId) {
      return $http.get('/api/hotel/' + hotelId).then(complete).catch(failed);
    }
    function postAddComment(hotelId, commentaire) {
      return $http.post('/api/hotel/' + hotelId, commentaire).then(complete).catch(failed);
    }
    function connexion(connexion) {
      return $http.post('/api/login', connexion).then(complete).catch(failed);
    }
    function complete(response) {
      return response;
    }
    function failed(error) {
      console.log(error.statusText);
    }
  });
})();
