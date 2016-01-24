app.controller("ProfileController", ['$scope', 'currentUser', 'user', '$route', 'userService', 'followService',
  function($scope, currentUser, user, $route, userService, followService){

    // from resolves
    $scope.currentUser = currentUser;
    $scope.user = user;

    // navbar
    $scope.logout = function(){
      userService.logout();
    };

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
      $scope.view.showEditForm = true;
      $scope.view.allPhotos = false;
      $scope.view.favPhotos = false;
    };

    // edit form
    $scope.editProfile = {};
    if (user.profile === "") {
      user.profile = "http://www.cs.colostate.edu/~bplungis/Proj4/Users/Mplungis/images/pic.jpg";
    }
    $scope.editProfile.profile = user.profile;

    $scope.edit = function(editProf){
      if (currentUser.username !== user.username) {
        alert("Stop.");
        userService.logout();
      } else if (editProf.profile === "") {
        editProf.profile = "http://www.cs.colostate.edu/~bplungis/Proj4/Users/Mplungis/images/pic.jpg";
      } else {
        userService.updateUser(user._id, editProf);
        $scope.toggleAllPhotos();
      }
    };

    // showing photos
    $scope.photos = user.photos;
    $scope.view.allPhotos = true;

    $scope.toggleAllPhotos = function(){
      $scope.view.allPhotos = true;
      $scope.view.showEditForm = false;
      $scope.view.favPhotos = false;
    };

    // showing favorite photos
    $scope.favoritePhotos = user.favoritePhotosPop;
    $scope.view.favPhotos = false;

    $scope.toggleFavPhotos = function(){
      $scope.view.favPhotos = true;
      $scope.view.allPhotos = false;
      $scope.view.showEditForm = false;
    };

    // follow button
    $scope.followReq = function(self, username){
      followService.findSelf(self).then(function(self){
        followService.findFriend(username).then(function(follow){
          $scope.test2 = self;
          $scope.test = follow;
        });
      });
    };
  }
]);














