app.controller("ProfileController", ['$scope', 'currentUser', 'user', '$route', 'userService',
  function($scope, currentUser, user, $route, userService){

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

    // navbar
    $scope.logout = function(){
      userService.logout();
    };

    // edit form
    $scope.editProfile = {};
    $scope.editProfile.profile = user.profile;

    $scope.edit = function(editProf){
      if (editProf.profile === "") {
        editProf.profile = "http://www.cs.colostate.edu/~bplungis/Proj4/Users/Mplungis/images/pic.jpg";
      }
      userService.updateUser(user._id, editProf);
    };
  }
]);














