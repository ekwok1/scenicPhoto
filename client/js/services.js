app.service("userService", ['$http', '$window', '$location',
  function($http, $window, $location){
    return {
      signup: function(newUser){
        return $http.post("/api/users/signup", newUser);
      },
      login: function(user){
        return $http.post("/api/users/login", user);
      },
      setCurrentUser: function(data){
        $window.localStorage.setItem("token", data.data.token);
        $window.localStorage.setItem("user", JSON.stringify(data.data.user));
        console.log(data);
      },
      logout: function(){
        $window.localStorage.clear();
        $location.path("/home");
      },
      getCurrentUser: function(){
        return JSON.parse($window.localStorage.getItem("user"));
      },
      getCurrentUserId: function(){
        return JSON.parse($window.localStorage.getItem("user")).id;
      }
    };
  }
]);

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
      }
    };
  }
]);








