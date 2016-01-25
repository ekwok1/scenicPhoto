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
      },
      getSingleUser: function(username){
        return $http.get("/api/users/"+username).then(function(user){
          return user.data;
        });
      },
      updateUser: function(username, updateUser){
        return $http.put("/api/users/"+username, updateUser).then(function(user){
          return user.config.data;
        });
      }
    };
  }
]);