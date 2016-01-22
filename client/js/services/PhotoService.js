app.service("photoService", ['$http', 'userService',
  function($http, userService){
    return {
      getPhotos: function(){
        return $http.get("/api/photos").then(function(photos){
          return photos.data;
        });
      },
      getPhoto: function(id){
        return $http.get("/api/photos/" + id).then(function(photo){
          return photo.data;
        });
      },
      postPhoto: function(newPhoto){
        var userId = userService.getCurrentUserId();
        return $http.post("/api/users/"+userId+"/photos", newPhoto).then(function(photo){
          return photo.data;
        });
      },
      editPhoto: function(editPhoto){
        var photoId = editPhoto.id;
        return $http.put("/api/photos/"+photoId, editPhoto).then(function(photo){
          return photo.data;
        });
      },
      deletePhoto: function(photoId){
        return $http.delete("/api/photos/"+photoId).then(function(photo){
          return photo.data;
        });
      },
      addStat: function(photoId, editPhoto){
        return $http.put("/api/photos/"+photoId, editPhoto).then(function(photo){
          return photo.data;
        });
      }
    };
  }
]);








