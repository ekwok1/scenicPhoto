var app = angular.module("scenicPhoto", ['ngRoute']);

app.config(["$routeProvider", "$locationProvider", 
  function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        template: '<h1>TEST</h1>'
      })
      .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
  }
]);