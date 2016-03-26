app.controller('MainController', function ($scope, $http, $firebaseArray) {

	$scope.fromDate = "2016-01-01"
	$scope.toDate = "2016-12-31"

	// search posts based on hashtag
	function getHash() {
		var base = 'https://api.instagram.com/v1/tags/'
		// api key retrieved from http://instagram.pixelunion.net/
		var service = document.getElementById('hashtag').value
		var apiKey = '332223274.1677ed0.db0e29b5847747c39c0495179fe10c69'
		var callback = 'JSON_CALLBACK'
		var url = base + service + '/media/recent?access_token=' + apiKey + '&callback=' + callback

		// use jsonp method to prevent CORS error
		$http.jsonp(url).then(function(data) {

			$scope.instadata = data
			console.log("returned json object: ")
			console.log($scope.instadata)

			// set up firebase reference
			var ref = new Firebase('https://sizzling-heat-3774.firebaseio.com/fbdata')

			// create a synchronized array 
  			$scope.fbdata = $firebaseArray(ref)

			// add new items to the array RETURNS ERROR
			// $scope.fbdata.$add($scope.instadata).then(
			// 	function(p){
  	// 			console.log(p.key())
  	// 			console.log($scope.instadata)
			// 	}, 
			// 	function(err){
  	// 			console.log("The expected Firebase action failed to occur this was your error: " + err)
			// 	})	

			// id to indiciate url for next page
			$scope.next_max_id = data.data.pagination.next_max_tag_id
			
			// default layout 
			$scope.layout = 'grid'

			$scope.commentArr = data.data.data[0].comments
			console.log("comment object: ")
			console.log($scope.commentArr)

			// function to enable next page view
			$scope.nextPage = function() {

				console.log("next button click") // check if ng-click is working

				// rebuild url from scratch in order to make new api call work bc calling 'next page url' doesn't fire
				var base = 'https://api.instagram.com/v1/tags/'
				var service = document.getElementById('hashtag').value
				var apiKey = '332223274.1677ed0.db0e29b5847747c39c0495179fe10c69'
				var callback = 'JSON_CALLBACK'
				var max_id = $scope.next_max_id

				var url = base + service + '/media/recent?access_token=' + apiKey + '&callback=' + callback + '&max_id=' + max_id

				$http.jsonp(url).then(function(data) {
					// new data to update view
					$scope.instadata = data
					console.log("returned next page object: ")
					console.log($scope.instadata)
				}) 
			}

		 })
	}
	// start search on click of search button
	document.getElementById('search').addEventListener('click', getHash, false)
})
