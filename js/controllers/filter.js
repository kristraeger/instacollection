// custom filter to display tag times in readable format
app.filter('convertUnix', function() {
    return function(input) {
    	//convert unix seconds into milliseconds for javascript
		var tempdate = new Date(parseInt(input * 1000)) 
		//create specific variables for hour, min and sec to add 0 for values < 10
		var hour = tempdate.getHours() < 10 ? '0' + tempdate.getHours() : tempdate.getHours()
		var min = tempdate.getMinutes() < 10 ? '0' + tempdate.getMinutes() : tempdate.getMinutes()
		var sec = tempdate.getSeconds() < 10 ? '0' + tempdate.getSeconds() : tempdate.getSeconds()
		var date = (tempdate.getMonth()+1)+"/"+tempdate.getDate()+"/"+tempdate.getFullYear() +" "+ hour +":"+ min +":"+ sec
        return date
    }
})

// custom filter to enable iframes
app.filter('convertUrl', ['$sce', function($sce) {
	return function(url) {
		if(url != undefined) {
			//create full media url
			var url_embed = url+'embed/'
			//make new url a trusted url (insta api docs)
			return $sce.trustAsResourceUrl(url_embed)
		}
	}
}])

// custom filter for date range
app.filter('dateFilter', function() {
	return function(data, from, to) {
	  	var dateFrom = unixDate(from)
	    var dateTo = unixDate(to)
	    var result = []  
		if(data != undefined) {
			for (var i=0; i<data.length; i++) {
				var createdTime = data[i].created_time     
				if (createdTime > dateFrom && createdTime < dateTo) {
				    result.push(data[i])
				    }
				}
		}
		return result    
  	}
})

