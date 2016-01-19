app.controller('SLController', ['$scope', 'userService', '$location',
  function($scope, userService, $location){
    $scope.view = {};
    $scope.view.showSignupForm = true;
    $scope.view.showLoginForm = false;

    $scope.toggleForm = function(){
      $scope.view.showSignupForm = !$scope.view.showSignupForm;
      $scope.view.showLoginForm = !$scope.view.showLoginForm;
    };

    $scope.signup = function(newUser){
      userService.signup(newUser).then(function(data){
        userService.setCurrentUser(data);
        $location.path("/photos");
      }, function(err){
        $scope.view.sErrors = err;
        $scope.newUser = {};
      });
    };

    $scope.login = function(user){
      userService.login(user).then(function(data){
        userService.setCurrentUser(data);
        $location.path("/photos");
      }, function(err){
        $scope.view.lErrors = err;
        $scope.newUser = {};
      });
    };
  }
]);

app.controller('PhotosController', ['$scope', 
  function($scope){
    $scope.test = "THIS IS A TEST";
  }
]);