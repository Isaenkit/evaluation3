angular.module('hobookhotel').directive('hbNavigation', hbNavigation);

function hbNavigation(){
  return {
    restrict: 'E',
    templateUrl: 'angular-app/navigation-directive/navigation-directive.html'
  };
}
