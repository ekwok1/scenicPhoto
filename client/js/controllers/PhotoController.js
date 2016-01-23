app.controller('PhotosController', 
  ['$scope', '$location', 'userService', 'currentUser', 'photos', 'photoService', 'user',
  function($scope, $location, userService, currentUser, photos, photoService, user){

    // from resolves
    $scope.currentUser = currentUser;
    $scope.photos = photos;
    $scope.user = user;

    // SPA booleans
    $scope.view = {};
    $scope.view.showPhotoForm = false;
    $scope.view.pErrors = false;

    // STAT functions
    $scope.like = function(id, photo){
      if (user.likedPhotos.indexOf(id) === -1){
        photo.numLikes++;
        photoService.addStat(id, photo)
        .then(function(){
          user.likedPhotos.push(photo._id);
          userService.updateUser(user._id, user);
        });
      }
    };

    $scope.dislike = function(id, photo){
      var index = user.likedPhotos.indexOf(id);
      if (index !== -1) {
        photo.numLikes--;
        photoService.addStat(id, photo)
        .then(function(){
          user.likedPhotos.splice(index, 1);
          userService.updateUser(user._id, user);
        });
      }
    };

    $scope.favorite = function(id, photo){
      // new approach because populated ObjectId arrays with whole object
      // method efficiency vs. storing another array in database memory...
      var contains = false;
      var addOnce = true;
      for (i=0; i<user.favoritePhotos.length; i++){
        if (user.favoritePhotos[i]._id === id) {
          contains = true;
          break;
        }
      }
      if (!contains) {
        photo.numFavorites++;
        addOnce = false;
        photoService.addStat(id, photo)
        .then(function(){
          user.favoritePhotos.push(photo._id);
          userService.updateUser(user._id, user);
        });
      }

      // old approach before populate array
      if (!contains && addOnce && user.favoritePhotos.indexOf(photo) === -1){
        photo.numFavorites++;
        photoService.addStat(id, photo)
        .then(function(){
          user.favoritePhotos.push(photo._id);
          userService.updateUser(user._id, user);
        });
      }
    };

    $scope.unfavorite = function(id, photo){
      var index = user.favoritePhotos.indexOf(id);
      if (index !== -1) {
        photo.numFavorites--;
        photoService.addStat(id, photo)
        .then(function(){
          user.favoritePhotos.splice(index, 1);
          userService.updateUser(user._id, user);
        });
      }
    };
    
    // navbar and ux functions
    $scope.toggleForm = function(){
      $scope.view.showPhotoForm = !$scope.view.showPhotoForm;
      $scope.newPhoto = {};
      $scope.newPhoto.username = currentUser.username;
    };

    $scope.resetAlert = function(){
      $scope.view.pErrors = false;
    };

    $scope.logout = function(){
      userService.logout();
    };

    // POST for photos
    $scope.post = function(newPhoto){
      if (newPhoto.username === currentUser.username) {
        photoService.postPhoto(newPhoto).then(function(photo){
          if (photo.message === "Photo validation failed") {
            $scope.view.pErrors = "Title, Photo Url, Description can't be blank.";
          } else {
            $scope.newPhoto = {};
            $scope.photos.push(photo);
            $scope.view.showPhotoForm = false;
          }
        });
      } else {
        $scope.view.pErrors = "You cannot post as another user.";
      }
    };
  }
]);

app.controller("PhotoController", 
  ['$scope', 'currentUser', 'photo', 'userService', '$location', 'photoService', 
    '$window', 'comments', 'commentService', '$route',
  function($scope, currentUser, photo, userService, $location, photoService, 
    $window, comments, commentService, $route){

    // important conditional
    if (!photo.message) {
      $scope.photo = photo;
    } else {
      $location.path("/photos");
    }
    
    // from resolves
    $scope.currentUser = currentUser;
    $scope.comments = comments.reverse();
    
    // SPA booleans
    $scope.view = {};
    $scope.view.showCommentPanel = true;
    $scope.view.showEditForm = false;
    $scope.view.eErrors = false;
    $scope.view.cErrors = false;

    // edit photo form presets
    $scope.editPhoto = {};
    $scope.editPhoto.id = photo._id;
    $scope.editPhoto.username = photo.username;
    $scope.editPhoto.updated_at = photo.updated_at;
    $scope.editPhoto.title = photo.title;
    $scope.editPhoto.photoUrl = photo.photoUrl;
    $scope.editPhoto.description = photo.description;

    // delete photo form presets
    $scope.deletePhoto = {};
    $scope.deletePhoto.id = photo._id;

    // post comment form presets
    $scope.comment = {};
    $scope.comment.username = currentUser.username;

    // stat counters
    $scope.numComments = comments.length;
    $scope.numLikes = photo.numLikes;
    $scope.numFavs = photo.numFavorites;

    // navbar and UX methods
    $scope.showButtons = function(){
      return currentUser.username === photo.username;
    };

    $scope.toggleForm = function(){
      $scope.view.showEditForm = true;
      $scope.view.showCommentPanel = false;
    };

    $scope.toggleComment = function(){
      $scope.view.showEditForm = false;
      $scope.view.showCommentPanel = true;
    };

    $scope.resetAlert = function(){
      $scope.view.eErrors = false;
      $scope.view.cErrors = false;
    };

    $scope.logout = function(){
      userService.logout();
    };

    // POST and DELETE for comments
    $scope.post = function(comment){
      if (comment.username !== currentUser.username){
        $scope.view.cErrors = "You cannot post comments as a different user.";
      } else if (comment.comment === "") {
        $scope.view.cErrors = "You cannot post a blank comment.";
      } else {
        commentService.postComment($route.current.params.id, comment).then(function(comment){
          $scope.comments.unshift(comment);
          $scope.comment = {};
          $scope.comment.username = currentUser.username;
          $scope.numComments++;
        });
      }
    };

    $scope.canDelete = function(user){
      if (currentUser.username === photo.username) return true;
      return currentUser.username === user;
    };

    $scope.deleteComment = function(index){
      var username = $scope.comments[index].username;
      if (username === currentUser.username || currentUser.username === photo.username) {
        var cId = $scope.comments[index]._id;
        $scope.comments.splice(index, 1);
        commentService.deleteComment($route.current.params.id, cId).then(function(comment){
          $scope.numComments--;
        });
      } else {
        $scope.view.cErrors = "You cannot delete another users' comments.";
      }
    };

    // PUT and DELETE for photo
    $scope.edit = function(editPhoto){
      if (currentUser.username !== photo.username || editPhoto.id !== photo._id) {
        alert("Stop trying to edit other people's photos...");
        $window.location.reload();
        userService.logout();
      } else if (editPhoto.title === "" || editPhoto.photoUrl === "" || editPhoto.description === "") {
        $scope.view.eErrors = "Please fill in all fields.";
      } else {
        editPhoto.updated_at = Date.now();
        photoService.editPhoto(editPhoto).then(function(photo){
          $scope.toggleComment();
        });
      }
    };

    $scope.delete = function(photoId){
      if (photoId !== photo._id || photo.username !== currentUser.username) {
        alert("Stop trying to delete other people's photos...");
        $window.location.reload();
        userService.logout();
      } else {
        photoService.deletePhoto(photoId).then(function(photo){
          $window.location.reload();
          $location.path("/users/"+currentUser.id);
        });
      }
    };
  }
]);


















