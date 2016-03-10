app.filter('convertUnix', function() {
    return function(input) {
    	//convert unix seconds into milliseconds for javascript
		var tempdate = new Date(parseInt(input * 1000)) 
		//create specific variables for min and sec to add 0 for values < 10
		var min = tempdate.getMinutes() < 10 ? '0' + tempdate.getMinutes() : tempdate.getMinutes()
		var sec = tempdate.getSeconds() < 10 ? '0' + tempdate.getSeconds() : tempdate.getSeconds()
		var date = (tempdate.getMonth()+1)+"/"+tempdate.getDate()+"/"+tempdate.getFullYear() +" "+tempdate.getHours() +":"+ min +":"+ sec
        return date
    }
})

app.filter('convertUrl', ['$sce', function($sce) {
	return function(url) {
		// create full media url
		var url_embed = url+'embed/'
		// make new url a trusted url (insta api docs)
		return $sce.trustAsResourceUrl(url_embed)
	}
}])


