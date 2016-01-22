app.service('commentService', ['$http', 
  function($http){
    return {
      getComments: function(pId){
        return $http.get("/api/photos/"+pId+"/comments").then(function(comments){
          return comments.data;
        });
      },
      postComment: function(pId, newComment){
        return $http.post("/api/photos/"+pId+"/comments", newComment).then(function(comment){
          return comment.data;
        });
      },
      deleteComment: function(pId, cId){
        return $http.delete("/api/photos/"+pId+"/comments/"+cId).then(function(comment){
          return comment.data;
        });
      }
    };
  }
]);