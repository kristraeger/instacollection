window.onload = function() {
  var input = document.getElementById('hashtag').focus()
}

function searchKeyPress(e) {
    if (e.keyCode == 13) {
        document.getElementById('hashtag').blur()
        return
    }
}
document.getElementById('hashtag').addEventListener('keypress', searchKeyPress, false)
