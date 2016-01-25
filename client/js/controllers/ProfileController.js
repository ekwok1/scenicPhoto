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
      $scope.view.showPendingRequest = true;
      $scope.view.showFollow = false;
      $scope.view.showPending = false;
    } else {
      $scope.view.showProfile = false;
    }

    if (user.pendingFollowRequest.indexOf(currentUser.id) !== -1){
      $scope.view.showPending = true;
      $scope.view.showFollow = false;
    } else {
      $scope.view.showPending = false;
      if (currentUser.username !== user.username) {
        $scope.view.showFollow = true;
      }
    }

    $scope.view.showEditForm = false;

    // SPA methods
    $scope.toggleEditForm = function(){
      $scope.view.showEditForm = true;
      $scope.view.allPhotos = false;
      $scope.view.favPhotos = false;
      $scope.view.pendingFollowInfo = false;
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
      $scope.view.pendingFollowInfo = false;
    };

    // showing favorite photos
    $scope.favoritePhotos = user.favoritePhotosPop;
    $scope.view.favPhotos = false;

    $scope.toggleFavPhotos = function(){
      $scope.view.favPhotos = true;
      $scope.view.allPhotos = false;
      $scope.view.showEditForm = false;
      $scope.view.pendingFollowInfo = false;
    };

    // follow button
    $scope.followReq = function(self, username){
      userService.getSingleUser(self).then(function(selfRes){
        userService.getSingleUser(username).then(function(usernameRes){
          var sent = false;
          for (i=0; i<selfRes.pendingFollowing.length; i++){
            if (selfRes.pendingFollowing[i] === usernameRes._id) {
              sent = true; break;
            }
          }
          if (!sent) {
            // push follow request to friend
            followService.deleteFields(selfRes);
            usernameRes.pendingFollowRequest.push(selfRes);
            usernameRes.pendingFollowRequestPop.push(selfRes);
            $scope.user.pendingFollowRequest.push(selfRes._id);
            $scope.user.pendingFollowRequestPop.push(selfRes._id);
            userService.updateUser(usernameRes.username, usernameRes).then(function(){
              // push follow request to self
              followService.deleteFields(usernameRes);
              delete usernameRes.pendingFollowRequest;
              delete usernameRes.pendingFollowRequestPop;
              selfRes.pendingFollowing.push(usernameRes);
              userService.updateUser(selfRes.username, selfRes);
            });
          }
        });
      });
      $scope.view.showFollow = false;
      $scope.view.showPending = true;
    };

    // pending follow display
    $scope.view.pendingFollowInfo = false;
    $scope.pending = $scope.user.pendingFollowRequestPop;
    $scope.togglePendingFollowInfo = function(){
      $scope.view.pendingFollowInfo = true;
      $scope.view.favPhotos = false;
      $scope.view.allPhotos = false;
      $scope.view.showEditForm = false;
    };

    // pending follow methods
    $scope.acceptFollow = function(self, followRequester, index){
      // add followRequester to follower array
      // remove followRequester from pendingFollowRequest(Pop) arrays
      // add self to followRequester's following array
      // remove self from followRequester's pendingFollowing array
      // save to db
    };

    $scope.rejectFollow = function(user, followRequester, index){
      if (currentUser.username !== user.username) {
        userService.logout();
      } else {
        followRequester = followRequester[index];
        
        // remove followRequester from user's requests
        user.pendingFollowRequestPop.splice(index, 1);
        user.pendingFollowRequest.splice(index, 1);
        $scope.user.pendingFollowRequestPop.splice(index, 1);
        $scope.user.pendingFollowRequest.splice(index, 1);
        // remove user from followRequester's requests
        var followId = followRequester._id;
        var idx = followRequester.pendingFollowing.indexOf(followId);
        followRequester.pendingFollowing.splice(idx, 1);
        // save to db
        userService.updateUser(user.username, user).then(function(test){
          userService.updateUser(followRequester.username, followRequester);
        });
      }
    };
  }
]);














