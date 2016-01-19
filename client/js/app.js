var app = angular.module("scenicPhoto", ['ngRoute']);

app.config(["$routeProvider", "$locationProvider", 
  function($routeProvider, $locationProvider){
    $routeProvider
      .when('/home', {
        templateUrl: 'templates/home.html',
        controller: 'SLController'
      })
      .otherwise({ redirectTo: '/home' });

    $locationProvider.html5Mode(true);
  }
]);