app.controller('PhotosController', 
  ['$scope', '$location', 'userService', 'currentUser', 'photos', 'photoService',
  function($scope, $location, userService, currentUser, photos, photoService){

    $scope.view = {};
    $scope.view.showPhotoForm = false;
    $scope.view.pErrors = null;
    
    $scope.currentUser = currentUser;
    $scope.photos = photos;

    $scope.toggleForm = function(){
      $scope.view.showPhotoForm = !$scope.view.showPhotoForm;
      $scope.newPhoto = {};
      $scope.newPhoto.username = currentUser.username;
    };

    $scope.logout = function(){
      userService.logout();
    };

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

    $scope.resetAlert = function(){
      $scope.view.pErrors = null;
    };

  }
]);

app.controller("PhotoController", 
  ['$scope', 'currentUser', 'photo', 'userService', '$location', 'photoService', '$window',
  function($scope, currentUser, photo, userService, $location, photoService, $window){
    
    $scope.view = {};
    $scope.view.showCommentPanel = true;
    $scope.view.showEditForm = false;
    $scope.view.eErrors = null;

    $scope.currentUser = currentUser;

    $scope.editPhoto = {};
    $scope.editPhoto.id = photo._id;
    $scope.editPhoto.username = photo.username;
    $scope.editPhoto.updated_at = photo.updated_at;
    $scope.editPhoto.title = photo.title;
    $scope.editPhoto.photoUrl = photo.photoUrl;
    $scope.editPhoto.description = photo.description;

    $scope.deletePhoto = {};
    $scope.deletePhoto.id = photo._id;

    if (!photo.message) {
      $scope.photo = photo;
    } else {
      $location.path("/photos");
    }

    $scope.toggleForm = function(){
      $scope.view.showCommentPanel = false;
      $scope.view.showEditForm = true;
    };

    $scope.toggleComment = function(){
      $scope.view.showCommentPanel = true;
      $scope.view.showEditForm = false;
    };

    $scope.logout = function(){
      userService.logout();
    };

    $scope.showButtons = function(){
      return currentUser.username === photo.username;
    };

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
          $scope.view.showEditForm = false;
          $scope.view.showCommentPanel = true;
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
          $location.path("/photos");
        });
      }
    };

    $scope.resetAlert = function(){
      $scope.view.eErrors = null;
    };
  }
]);



















