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

app.service("AuthInterceptor", ['$window', '$location', '$q', 'userService',
  function($window, $location, $q){
    return {
      request: function(config){
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        return $q.resolve(config);
      },
      responseError: function(err){
        if(err.data === "invalid token" || err.data === "invalid signature" || err.data === "jwt malformed"){
          userService.logout();
          $location.path("/home");
          return $q.resolve(err);
        }
        if (err.status === 401){
          $location.path("/photos");
          return $q.resolve(err);
        }
        return $q.resolve(err);
      }
    };
  }
]);






















