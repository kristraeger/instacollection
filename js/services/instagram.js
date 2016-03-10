app.factory('instagram', ['$http', function($http) { 
  var key = '332223274.1677ed0.db0e29b5847747c39c0495179fe10c69'
  var tag = 'cats'
  return $http.get('https://api.instagram.com/v1/tags/'+ tag + '/media/recent?access_token=' + key) 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);

