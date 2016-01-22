app.controller("ProfileController", ['$scope', 'currentUser', 'user',
  function($scope, currentUser, user){

    // from resolves
    $scope.currentUser = currentUser;
    $scope.user = user;

    // SPA booleans
    $scope.view = {};
    if (currentUser.username === user.username) {
      $scope.view.showProfile = true;
      $scope.view.showFollow = false;
    } else {
      $scope.view.showProfile = false;
      $scope.view.showFollow = true;
    }

    
    
  }
]);