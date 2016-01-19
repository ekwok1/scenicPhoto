var app = angular.module("scenicPhoto", ['ngRoute']);

app.config(["$routeProvider", "$locationProvider", 
  function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'SLController'
      })
      .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
  }
]);