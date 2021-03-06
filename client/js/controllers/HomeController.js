app.controller('SLController', ['$scope', 'userService', '$location',
  function($scope, userService, $location){
    $scope.view = {};
    $scope.view.showSignupForm = true;
    $scope.view.showLoginForm = false;
   
    $scope.resetAlert = function(){
      $scope.view.sErrors = null;
      $scope.view.lErrors = null;
    };

    $scope.toggleForm = function(){
      $scope.view.showSignupForm = !$scope.view.showSignupForm;
      $scope.view.showLoginForm = !$scope.view.showLoginForm;
      $scope.user = {};
      $scope.newUser = {};
      $scope.resetAlert();
    };

    $scope.signup = function(newUser){
      userService.signup(newUser).then(function(data){
        userService.setCurrentUser(data);
        $location.path("/photos");
        if (data.status===500){
          $scope.view.sErrors = data.data;
        }
        $scope.newUser = {};
      });
    };

    $scope.login = function(user){
      userService.login(user).then(function(data){
        userService.setCurrentUser(data);
        $location.path("/photos");
        if (data.status===401 || data.status===500){
          $scope.view.lErrors = data.data;
        }
        $scope.user = {};
      });
    };
  }
]);