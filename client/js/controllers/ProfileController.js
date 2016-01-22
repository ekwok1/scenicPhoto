app.controller("ProfileController", ['$scope', 'currentUser', 'user',
  function($scope, currentUser, user){

    // from resolves
    $scope.currentUser = currentUser;
    $scope.user = user;
    
  }
]);