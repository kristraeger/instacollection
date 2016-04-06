app.controller('MainController', function ($scope, $http, $firebaseArray) {

	// set up firebase reference
	var ref = new Firebase('https://sizzling-heat-3774.firebaseio.com/fbdata')

	// create a synchronized array 
  	$scope.fbdata = $firebaseArray(ref)

  	// check if data already exists in fb and change collection view
  	ref.once('value', function(snapshot) {
  		$scope.dataAdded = snapshot.exists()
  		// returns true if any data exists
  	})

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
		$scope.results = results

		// variable to store temp results from matching
		var tempResults = []
		$scope.tempResults = tempResults

		// initial api call
		// jsonp method to prevent CORS err
		$http.jsonp(url).then(function(data) {

			// save response in variable
			$scope.instadata = data
			console.log("returned json object: ")
			console.log($scope.instadata)

			// id to build url for next page
			$scope.next_max_id = data.data.pagination.next_max_tag_id

			// images only
			var initialPosts = data.data.data

			// loop through posts and look for results matching fromDate-toDate
			function matchData(posts) {

				console.log("matching images to dates")

				// get dates to match images with
				var dateFrom = unixDate(document.getElementById('fromDate').value)
				console.log(dateFrom)
				var dateTo = unixDate(document.getElementById('toDate').value)
				console.log(dateTo)
				// clear temp results
				tempResults = []

					// find new results
					for ( var i=0; i<posts.length; i++) {
						var createdTime = posts[i].created_time  
						if (createdTime >= dateFrom && createdTime <= dateTo) {
						// save to temp results and use as check
					    tempResults.push(posts[i])
					    // save to all results
					    results.push(posts[i])
						}
					}	

					// find at least one new match
					if (tempResults.length < 1 ) {
						getData()
					}
				console.log("new matching results are:")
				console.log(tempResults)
			}

			matchData(initialPosts)

			// get more data using next_max_id
			function getData() {

				console.log("getting new data")

				var newPosts

				function apiCall(cb, posts) {

						// rebuild url from scratch (next_page_url doesn't fire)
						var max_id = $scope.next_max_id
						var url_next = base + tag + '/media/recent?access_token=' + apiKey + '&callback=' + callback + '&max_id=' + max_id
						
						// api call to next page
						$http.jsonp(url_next).then(function(data) {

							console.log("making api call")

							// assign new value to max_id
							$scope.next_max_id = data.data.pagination.next_max_tag_id
							max_id = $scope.next_max_id
							// TODO if this returns "undefined" = user message "no more images available"
							console.log("next max id: " + $scope.next_max_id) 

							// get new images
							newPosts = data.data.data
							console.log("new posts are:")
							console.log(newPosts)

							// call matchData as cb
							cb(newPosts)
						})
					}
				
				apiCall(matchData, newPosts)
			
			} // end getData

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
		  				$scope.dataAdded = true
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
				getData()
			} 
		 }) // end $http inital
	} // end getHash()
	// start search on click of search button
	document.getElementById('search').addEventListener('click', getHash, false)
})
