app.service('commentService', ['$http', 
  function($http){
    return {
      getComments: function(pId){
        $http.get("/api/photos/"+pId+"/comments").then(function(comments){
          return comments.data;
        });
      },
      postComment: function(pId){
        $http.post("/api/photos/"+pId+"/comments").then(function(comment){
          return comments.data;
        });
      },
      deleteComment: function(pId, cId){
        $http.delete("/api/photos/"+pId+"/comments/"+cId).then(function(comment){
          return comments.data;
        });
      }
    };
  }
]);