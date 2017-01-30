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
  app.controller('accueilController', function(hotelService){
    this.login = function(form) {
      var connexion = {
        email : form.email,
        password : form.password
      };

      hotelService.connexion(connexion).then((response) => {
        console.log(response.data);
      });
    }
  });

  app.controller('homeController', function(hotelService){
    this.hotels = [];
    hotelService.hotelsGetAll().then((response) => {
      this.hotels = response.data;
    });
  });

  app.controller('hotelController', function(hotelService, $routeParams) {
    var id = $routeParams.hotelId;
    this.hotel = {};

    hotelService.hotelsGetOne(hotelId).then((response) => {
      console.log(response.data);
      this.hotel = response.data;
    });
    this.ajouterCommentaire = function(form) {
      var commentaire = {
        name : form.name,
        rating : parseInt(form.rating, 10),
        commentaire : form.commentaire
      };

      hotelService.postAddComment(hotelId, commentaire).then((response) => {
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
      controllerAs: 'homeStore'
    })
    .when('/hotel/:id', {
      templateUrl: 'angular-app/partials/hotel.html',
      controller: 'hotelController',
      controllerAs: 'hotelStore'
    })
    .otherwise({
      redirectTo:'/'
    })
}]);

  // Service pour les hotels
  app.factory('hotelService', function($http){
    return {
      hotelsGetAll : hotelsGetAll,
      hotelsGetOne : hotelsGetOne,
      postAddComment : postAddComment,
      connexion : connexion
    };
    function hotelsGetAll() {
      return
      $http.get('/api/hotel').then(complete).catch(failed);
    }
    function hotelsGetOne() {
      return
      $http.get('/api/hotel/' + hotelId).then(complete).catch(failed);
    }
    function postAddComment(hotelId, commentaire) {
      return $http.post('/api/hotel/' + hotelId, commentaire).then(complete).catch(failed);
    }
    function connexion(connexion) {
      return $http.post('/api/login', connexion).then(complete).catch(failed);
    }
    function complete(response) {
      return
      response;
    }
    function failed(error) {
      console.log(error.statusText);
    }
  });
})();
