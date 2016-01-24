app.service("followService", ['$http', 
  function($http){
    return {
      findSelf: function(username){
        return $http.get("/api/users/"+username).then(function(self){
          self.data = {username: self.data.username, profile: self.data.profile};
          return self.data;
        });
      },
      findFriend: function(username){
        return $http.get("/api/users/"+username).then(function(user){
          user.data = {pendingFollowRequest: user.data.pendingFollowRequest};
          return user.data;
        });
      }
    };
  }
]);