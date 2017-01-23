angular.module('hobookhotel', ['ngRoute']).config(config);

function config($httpProvider, $routeProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');

  $routeProvider
  .when('/', {
    templateUrl: 'angular-app/main/main.html',
    controller: 'HotelsController',
    controllerAs: 'vm'

  })
  .when('/hotels', {
    templateUrl: 'angular-app/hotel-list/hotels.html',
    controller: 'HotelsController',
    controllerAs: 'vm'
  })
  .when('/hotel/:id', {
    templateUrl: 'angular-app/hotel-display/hotel.html',
    controller: 'HotelController',
    controllerAs: 'vm'
  })
  .when('/profile', {
    templateUrl: 'angular-app/profile/profile.html',
  })
  .when('/register', {
    templateUrl: 'angular-app/register/register.html',
    controller: 'RegisterController',
    controllerAs: 'vm'
  })
  .otherwise({
    redirectTo:'/'
  });
}

function run($rootScope, $location, $window, AuthFactory) {
  $rootScope.$on('$routeChangeStart',function(event, nextRoute, currentRoute){
    if (nextRoute.access !== undefined && nextRoute.access.restricted && !window.sessionStorage.token && !AuthFactory.isLoggedIn) {
      event.preventDefault();
      $location.path('/');
    }
  })
}
