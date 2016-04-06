// when window loads
window.onload = function() {
	// focus on search input field
	document.getElementById('hashtag').focus()
    // set default dates
    document.getElementById('fromDate').value = "2016-01-01"
    document.getElementById('toDate').value = "2016-12-31"
}

// enable search when hit enter
function searchKeyPress(e) {
    if (e.keyCode == 13) {
        document.getElementById('search').click()
        return
    }
}
document.getElementById('hashtag').addEventListener('keypress', searchKeyPress, false)
document.getElementById('fromDate').addEventListener('keypress', searchKeyPress, false)
document.getElementById('toDate').addEventListener('keypress', searchKeyPress, false)

// function to convert input dates to unix
function unixDate(input) {
    if (input != undefined) {
        // split input into temp arr (year, month, day)
        var temp = input.split('-')
        console.log(temp)
        // convert YYY-MM-DD format to valid Date Object (add 1 day to inlude today results)
        var dateObj =  new Date(temp[0], temp[1]-1, temp[2], 23, 59)
        console.log(dateObj)
        // convert Date Object to unix timestamp
        return Math.round(dateObj.getTime()/1000).toString()
    }
}

