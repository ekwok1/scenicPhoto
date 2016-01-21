var app = angular.module("scenicPhoto", ['ngRoute']);

app.config(["$routeProvider", "$locationProvider", "$httpProvider",
  function($routeProvider, $locationProvider, $httpProvider){
    $routeProvider
      .when('/home', {
        templateUrl: 'templates/home.html',
        controller: 'SLController',
        preventWhenLoggedIn: true
      })
      .when('/photos', {
        templateUrl: 'templates/photos.html',
        controller: 'PhotosController',
        restricted: true,
        resolve: {
          currentUser: ['userService', function(userService){
            return userService.getCurrentUser();
          }],
          photos: ['photoService', function(photoService){
            return photoService.getPhotos();
          }]
        }
      })
      .when('/photos/:id', {
        templateUrl: 'templates/photo.html',
        controller: 'PhotoController',
        restricted: true,
        resolve: {
          currentUser: ['userService', function(userService){
            return userService.getCurrentUser();
          }],
          photo: ['photoService', '$route', function(photoService, $route){
            return photoService.getPhoto($route.current.params.id);
          }]
        }
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
        var token = $window.localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
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

app.run(['$rootScope', '$location', '$window', 
  function($rootScope, $location, $window){
    $rootScope.$on("$routeChangeStart", function(event, next, current){
      if (next.restricted && !$window.localStorage.getItem("token")){
        $window.localStorage.clear();
        $location.path("/home");
      }
      if (next.restricted && $window.localStorage.getItem("token") === "undefined"){
        $window.localStorage.clear();
        $location.path("/home");
      }
      if (next.preventWhenLoggedIn && $window.localStorage.getItem("token")){
        $location.path("/photos");
      }
    });
  }
]);












