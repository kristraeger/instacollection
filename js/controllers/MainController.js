app.controller('MainController', function ($scope, $http, $firebaseArray) {

	// set up firebase reference
	var ref = new Firebase('https://sizzling-heat-3774.firebaseio.com/fbdata')

	// create a synchronized array 
  	$scope.fbdata = $firebaseArray(ref)

	// search posts based on hashtag and fromDate-toDate
	function getHash() {

		var base = 'https://api.instagram.com/v1/tags/'
		var tag = document.getElementById('hashtag').value
		// api key retrieved from http://instagram.pixelunion.net/
		var apiKey = '332223274.1677ed0.db0e29b5847747c39c0495179fe10c69'
		var callback = 'JSON_CALLBACK'
		// initial url
		var url = base + tag + '/media/recent?access_token=' + apiKey + '&callback=' + callback

		// add hashtag to scope
  		$scope.hashtag = tag

  		// add dates to scope
  		$scope.fromDate = document.getElementById('fromDate').value
		$scope.toDate = document.getElementById('toDate').value

		// store matching results in variable
		var results = []

		// initial api call --TODO get ALL results, not only 20
		// jsonp method to prevent CORS err
		$http.jsonp(url).then(function(data) {

			// save response in variable
			$scope.instadata = data
			console.log("returned json object: ")
			console.log($scope.instadata)

			// id to build url for next page
			$scope.next_max_id = data.data.pagination.next_max_tag_id

			// paginate through endpoint and push data to results -- MAKE IT WORK
			function getData() {
				// rebuild url from scratch since next_page_url doesn't fire
				var max_id = $scope.next_max_id
				var url_next = base + tag + '/media/recent?access_token=' + apiKey + '&callback=' + callback + '&max_id=' + max_id
				$http.jsonp(url_next).then(function(data) {

				// return both values as object literal 
					$scope.instadata = data
					$scope.next_max_id = data.data.pagination.next_max_tag_id
				})
			}

			// loop through posts and look for results matching fromDate-toDate
			var posts = data.data.data
			console.log("posts: ")
			console.log(posts)

			var dateFrom = unixDate(document.getElementById('fromDate').value)
			var dateTo = unixDate(document.getElementById('toDate').value)
			for ( var i=0; i<posts.length; i++) {
				var createdTime = posts[i].created_time  
				if (createdTime > dateFrom && createdTime < dateTo) {
				    results.push(posts[i])
				}
			}
			console.log(results)

			// add data to array in firebase
			$scope.addData = function() {
				$scope.fbdata.$add(
					// add search results
					results
					)
					// add dates and hashtag to search items
					.then(		
						function(p){
		  				console.log("items added to database!")
		  				p.push(
		  					{
						hashtag: $scope.hashtag,
						from: $scope.fromDate, 
						to: $scope.toDate})
						}, 
						function(err){
		  				console.log("items could not be added: " + err)
						})
			}

			// default layout 
			$scope.layout = 'list'

			// enable searchView in list
			$scope.searchView = true

			// function to enable next page view
			$scope.nextPage = function() {

				console.log("next button click")

				// rebuild url from scratch since next_page_url doesn't fire
				var max_id = $scope.next_max_id
				var url = base + tag + '/media/recent?access_token=' + apiKey + '&callback=' + callback + '&max_id=' + max_id

				$http.jsonp(url).then(function(data) {
					// new data to update view
					$scope.instadata = data
					console.log("returned next page object: ")
					console.log($scope.instadata)

					// add data to array
					$scope.fbdata.$add(
						// add search items
						$scope.instadata.data)
							// add dates and hashtag to search items using promises
							.then(		
							function(p){
			  				console.log("items added to database!")
			  				p.push(
			  					{
							hashtag: $scope.hashtag,
							from: $scope.fromDate, 
							to: $scope.toDate})
							}, 
							function(err){
			  				console.log("items could not be added: " + err)
							})
				})
			} // end nextPage()
		 }) // end $http inital
	} // end getHash()
	// start search on click of search button
	document.getElementById('search').addEventListener('click', getHash, false)
})
