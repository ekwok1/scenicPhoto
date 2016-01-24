app.service("followService", ['$http', 
  function($http){
    return {
      deleteFields: function(user){
        delete user.password; delete user.followers; delete user.following;
        delete user.favoritePhotos; delete user.favoritePhotosPop;
        delete user.likedPhotos; delete user.photos; delete user.__v;

      }
    };
  }
]);