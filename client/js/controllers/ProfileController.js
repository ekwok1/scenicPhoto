app.controller("ProfileController", ['$scope', 'currentUser', 'user',
  function($scope, currentUser, user){

    // from resolves
    $scope.currentUser = currentUser;
    $scope.user = user;

    // SPA booleans
    $scope.view = {};
    if (currentUser.username === user.username) {
      $scope.view.showEditProfile = true;
      $scope.view.showFollow = false;
    } else {
      $scope.view.showEditProfile = false;
      $scope.view.showFollow = true;
    }

    
    
  }
]);