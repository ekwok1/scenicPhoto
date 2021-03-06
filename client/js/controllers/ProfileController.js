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
    } else {
      if (user.followers.indexOf(currentUser.id) === -1){
        $scope.view.showFollow = true;
      }
      if (user.pendingFollowRequest.indexOf(currentUser.id) !== -1){
        $scope.view.showFollow = false;
        $scope.view.showPending = true;
      }
      var following = false;
      for (i=0; i<user.followers.length; i++){
        if (user.followers[i]._id === currentUser.id){
          following = true; break;
        }
      }
      if (following){
        $scope.view.showFollow = false;
        $scope.view.showPending = false;
        $scope.view.showUnfollow = true;
      }
    }

    $scope.view.showEditForm = false;

    // SPA methods
    $scope.toggleEditForm = function(){
      $scope.view.showEditForm = true;
      $scope.view.allPhotos = false;
      $scope.view.favPhotos = false;
      $scope.view.pendingFollowInfo = false;
      $scope.view.followers = false;
      $scope.view.following = false;
      $scope.view.followers = false;
    };

    // edit form
    $scope.editProfile = {};
    if (user.profile === "") {
      user.profile = "http://www.cs.colostate.edu/~bplungis/Proj4/Users/Mplungis/images/pic.jpg";
    }
    $scope.editProfile.profile = user.profile;

    $scope.edit = function(editProf){
      if (currentUser.username !== user.username) {
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
      $scope.view.followers = false;
      $scope.view.following = false;
      $scope.view.followers = false;
    };

    // showing favorite photos
    $scope.favoritePhotos = user.favoritePhotosPop;
    $scope.view.favPhotos = false;

    $scope.toggleFavPhotos = function(){
      $scope.view.favPhotos = true;
      $scope.view.allPhotos = false;
      $scope.view.showEditForm = false;
      $scope.view.pendingFollowInfo = false;
      $scope.view.followers = false;
      $scope.view.following = false;
      $scope.view.followers = false;
    };

    // showing followers
    $scope.followers = user.followers;
    $scope.view.followers = false;

    $scope.toggleFollowers = function(){
      $scope.view.followers = true;
      $scope.view.favPhotos = false;
      $scope.view.allPhotos = false;
      $scope.view.showEditForm = false;
      $scope.view.pendingFollowInfo = false;
      $scope.view.following = false;
      $scope.view.followers = false;
    };

    // showing following
    $scope.following = user.following;
    $scope.view.following = false;

    $scope.toggleFollowing = function(){
      $scope.view.following = true;
      $scope.view.followers = false;
      $scope.view.favPhotos = false;
      $scope.view.allPhotos = false;
      $scope.view.showEditForm = false;
      $scope.view.pendingFollowInfo = false;
      $scope.view.followers = false;
    };

    // pending follow display
    $scope.pending = user.pendingFollowRequestPop;
    $scope.view.pendingFollowInfo = false;

    $scope.togglePendingFollowInfo = function(){
      $scope.view.pendingFollowInfo = true;
      $scope.view.following = false;
      $scope.view.followers = false;
      $scope.view.favPhotos = false;
      $scope.view.allPhotos = false;
      $scope.view.showEditForm = false;
      $scope.view.followers = false;
    };

    // showing followers
    $scope.followers = user.followers;
    $scope.view.followers = false;

    $scope.toggleFollower = function(){
      $scope.view.followers = true;
      $scope.view.pendingFollowInfo = false;
      $scope.view.following = false;
      $scope.view.favPhotos = false;
      $scope.view.allPhotos = false;
      $scope.view.showEditForm = false;
    };


    // methods for follow/unfollow
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
            followService.deleteFieldsAddReq(selfRes);
            usernameRes.pendingFollowRequest.push(selfRes);
            usernameRes.pendingFollowRequestPop.push(selfRes);
            $scope.user.pendingFollowRequest.push(selfRes._id);
            $scope.user.pendingFollowRequestPop.push(selfRes._id);
            userService.updateUser(usernameRes.username, usernameRes).then(function(){
              // push follow request to self
              followService.deleteFieldsAddReq(usernameRes);
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

    $scope.removeRequest = function(user, followRequester, index){
      // remove followRequester from user's requests
      user.pendingFollowRequestPop.splice(index, 1);
      user.pendingFollowRequest.splice(index, 1);
      // remove user from followRequester's requests
      followRequester.pendingFollowing.splice(index, 1);
    };

    $scope.acceptFollowHelper = function(user){
      var obj = {};
      var keys = Object.keys(user);
      keys.forEach(function(key){
        if (key !== "followers"){
          obj[key] = user[key];
        }
      });
      return obj;
    };

    $scope.acceptFollow = function(user, followRequester, index){
      if (currentUser.username !== user.username) {
        userService.logout();
      } else {
        followRequester = followRequester[index];
        // remove requests from user model arrays and save to db
        $scope.removeRequest(user, followRequester, index);
        userService.updateUser(user.username, user).then(function(userRes){
          userService.updateUser(followRequester.username, followRequester).then(function(followReqRes){
            // add follower/following statuses and save to db
            followService.deleteFieldsAcceptReq(followRequester);
            delete followRequester.followers;
            user.followers.push(followRequester);
            userService.updateUser(user.username, user).then(function(){
              followRequester.following.push($scope.acceptFollowHelper(user));
              userService.updateUser(followRequester.username, followRequester);
            });
          });
        });
      }
    };

    $scope.rejectFollow = function(user, followRequester, index){
      if (currentUser.username !== user.username) {
        userService.logout();
      } else {
        followRequester = followRequester[index];
        // remove requests from user model arrays
        $scope.removeRequest(user, followRequester, index);
        // save to db
        userService.updateUser(user.username, user).then(function(){
          userService.updateUser(followRequester.username, followRequester);
        });
      }
    };

    $scope.unfollow = function(user, followed){
      if (currentUser.username !== user) {
        userService.logout();
      } else {
        userService.getSingleUser(user).then(function(userRes){
          userService.getSingleUser(followed).then(function(followedRes){
            var userId = userRes._id;
            var followedId = followedRes._id;
            for (i=0; i<userRes.following.length; i++){
              if (userRes.following[i]._id === followedId){
                userRes.following.splice(i, 1); break;
              }
            }
            for (i=0; i<followedRes.followers.length; i++){
              if (followedRes.followers[i]._id === userId){
                followedRes.followers.splice(i, 1); break;
              }
            }
            userService.updateUser(user, userRes).then(function(){
              userService.updateUser(followed, followedRes).then(function(followedResUpdate){
                $scope.user = followedResUpdate;
                $scope.followers = followedResUpdate.followers;
              });
            });
          });
        });
        $scope.view.showUnfollow = false;
        $scope.view.showFollow = true;
      }
    };
  }
]);






















