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

    if (user.pendingFollowRequest.indexOf(currentUser.id) !== -1){
      $scope.view.showPending = true;
      $scope.view.showFollow = false;
    } else {
      $scope.view.showPending = false;
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
        userService.updateUser(user.username, editProf);
        $scope.toggleAllPhotos();
      } else {
        userService.updateUser(user.username, editProf);
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
      userService.getSingleUser(self).then(function(selfReq){
        userService.getSingleUser(username).then(function(usernameReq){
          var sent = false;
          for (i=0; i<selfReq.pendingFollowing.length; i++){
            if (selfReq.pendingFollowing[i] === usernameReq._id) {
              sent = true; break;
            }
          }

          if (!sent) {
            // push follow request to friend
            followService.deleteFields(selfReq);
            usernameReq.pendingFollowRequest.push(selfReq);
            $scope.user.pendingFollowRequest.push(selfReq._id);
            userService.updateUser(usernameReq.username, usernameReq).then(function(){
              // push follow request to self
              followService.deleteFields(usernameReq);
              delete usernameReq.pendingFollowRequest;
              selfReq.pendingFollowing.push(usernameReq);
              userService.updateUser(selfReq.username, selfReq);
            });
          }
        });
        $scope.view.showFollow = false;
        $scope.view.showPending = true;
      });
    };
  }
]);














