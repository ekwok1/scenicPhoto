var app = angular.module("scenicPhoto", ['ngRoute']);

app.config(["$routeProvider", "$locationProvider", 
  function($routeProvider, $locationProvider){
    $routeProvider
      .when('/home', {
        templateUrl: 'templates/home.html',
        controller: 'SLController'
      })
      .when('/photos', {
        templateUrl: 'templates/photos.html',
        controller: 'PhotosController'
      })
      .otherwise({ redirectTo: '/home' });

    $locationProvider.html5Mode(true);
  }
]);