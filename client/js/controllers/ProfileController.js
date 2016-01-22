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

    $scope.view.showEditForm = false;

    // SPA methods
    $scope.toggleEditForm = function(){
      $scope.view.showEditForm = !$scope.view.showEditForm;
    };

    // navbar
    $scope.logout = function(){
      userService.logout();
    };

    // edit form
    $scope.editProfile = {};
    $scope.editProfile.profile = user.profile;

    $scope.edit = function(editProf){
      if (currentUser.username !== user.username) {
        alert("Stop.");
        userService.logout();
      } else if (editProf.profile === "") {
        editProf.profile = "http://www.cs.colostate.edu/~bplungis/Proj4/Users/Mplungis/images/pic.jpg";
      } else {
        userService.updateUser(user._id, editProf);
      }
    };
  }
]);














