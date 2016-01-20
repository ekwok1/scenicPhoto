app.service("userService", ['$http', '$window',
  function($http, $window){
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
      },
      getCurrentUser: function(){
        return JSON.parse($window.localStorage.getItem("user"));
      }
    };
  }
]);

app.service("photoService", ['$http', 
  function($http){
    return {
      getPhotos: function(){
        return $http.get("/api/photos").then(function(photos){
          return photos.data;
        });
      }
    };
  }
]);