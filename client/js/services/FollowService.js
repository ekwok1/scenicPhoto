app.service("followService", ['$http', 
  function($http){
    return {
      deleteFieldsAddReq: function(user){
        delete user.password; delete user.followers; delete user.following;
        delete user.favoritePhotos; delete user.favoritePhotosPop;
        delete user.likedPhotos; delete user.photos; delete user.__v;
      },
      deleteFieldsAcceptReq: function(user){
        delete user.password; delete user.favoritePhotos; delete user.favoritePhotosPop;
        delete user.likedPhotos; delete user.photos; delete user.__v;
        delete user.pendingFollowRequestPop; delete user.pendingFollowRequest;
        delete user.pendingFollowing;
      }
    };
  }
]);