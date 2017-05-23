
//  Search Button Event Listener
document.getElementById('search-form').addEventListener('submit', searchQuery);

// Get Albums
function searchQuery(event) {
	var query = document.getElementById("query").value;
	var req = new XMLHttpRequest(); 
	var url = "https://api.spotify.com/v1/search?q=" + query + "&type=album";
	req.open("GET", url, true);
	req.addEventListener('load', function() {
	  if(req.status >= 200 && req.status < 400){
	    var response = JSON.parse(req.responseText);
	    displayAlbums(response);
	  } else {
	      console.log("Error in network request: " + req.statusText);
	  }
	});
	
	req.send(null);
	event.preventDefault();
}	

// Append albums to div
function displayAlbums(object) {
	var albumArray = object.albums.items;
	var results = document.getElementById("results");
	while (results.firstChild) {
	  results.removeChild(results.firstChild);
	}
	for (var i = 0; i < albumArray.length; i++) {	
		var image = document.createElement("IMG");
		image.className = "cover";
		image.setAttribute("src", albumArray[i].images[0].url );
		results.appendChild(image);
	}
}

