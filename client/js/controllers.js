app.controller('SLController', ['$scope', 
  function($scope){
    $scope.view = {};
    $scope.view.showSignupForm = true;
    $scope.view.showLoginForm = false;

    $scope.toggleForm = function(){
      $scope.view.showSignupForm = !$scope.view.showSignupForm;
      $scope.view.showLoginForm = !$scope.view.showLoginForm;
    };

    $scope.signup = function(newUser){
      // need to write userService
    };

    $scope.login = function(user){
      // need to write userService
    };
  }
]);