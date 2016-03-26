// when window loads
window.onload = function() {
	// focus on search input field
	var input = document.getElementById('hashtag').focus()
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
    // split input into temp arr (year, month, day)
    var temp = input.split('-')
    // convert YYY-MM-DD format to valid Date Object
    var dateObj =  new Date(temp[0], temp[1]-1, temp[2])
    // convert Date Object to unix timestamp
    return Math.round(dateObj.getTime()/1000).toString()
}

