app.controller('MainController', function ($scope, $http){
		//search posts based on hastag
	function getHash() {
		var base = 'https://api.instagram.com/v1/tags/'
		// api key retrieved from http://instagram.pixelunion.net/
		var service = document.getElementById('hashtag').value
		var apiKey = '332223274.1677ed0.db0e29b5847747c39c0495179fe10c69'
		var callback = 'JSON_CALLBACK'
		// use jsonp method to prevent CORS error
		var url = base + service + '/media/recent?access_token=' + apiKey + '&callback=' + callback
		    $http.jsonp(url).then(function(data) {
			$scope.instadata = []
		    $scope.instadata = data
			console.log($scope.instadata)
			$scope.postArr = data.data.data
			$scope.commentArr = data.data.data[0].comments
			console.log($scope.commentArr)
			$scope.layout = 'grid';
		    })
	    }
	document.getElementById('hashtag').addEventListener('blur', getHash, false)


})




