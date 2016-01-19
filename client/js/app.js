var app = angular.module("scenicPhoto", ['ngRoute']);

app.config(["$routeProvider", "$locationProvider", "$httpProvider",
  function($routeProvider, $locationProvider, $httpProvider){
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

    $httpProvider.interceptors.push("AuthInterceptor");
  }
]);

app.service("AuthInterceptor", ['$window', '$location', '$q',
  function($window, $location, $q){
    return {
      request: function(config){
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        return $q.resolve(config);
      },
      responseError: function(err){
        if(err.data === "invalid token" || err.data === "invalid signature" || err.data === "jwt malformed"){
          $window.localStorage.clear();
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





















