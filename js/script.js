   
   (function() {

        var stateKey = 'spotify_auth_state';  //state key

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }

        /**
         * Generates a random string containing numbers and letters
         * @param  {number} length The length of the string
         * @return {string} The generated string
         */
        function generateRandomString(length) {
          var text = '';
          var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

          for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
        };

        // Get template source and compile 
        var userProfileSource = document.getElementById('user-profile-template').innerHTML,
            userProfileTemplate = Handlebars.compile(userProfileSource),
            userProfilePlaceholder = document.getElementById('user-profile');

            oauthSource = document.getElementById('oauth-template').innerHTML,
            oauthTemplate = Handlebars.compile(oauthSource),
            oauthPlaceholder = document.getElementById('oauth');

        // Params object from hash
        var params = getHashParams();

        // Assign params to variables
        var access_token = params.access_token,
            state = params.state,
            storedState = localStorage.getItem(stateKey);

        // If authenticated, then make call to retreive user info
        if (access_token && (state == null || state !== storedState)) {
          alert('There was an error during the authentication');
        } else {
          localStorage.removeItem(stateKey);
          if (access_token) {
            $.ajax({
                url: 'https://api.spotify.com/v1/me/',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                  $('#login').hide();
                  $('#loggedin').show();
                }
            });
          } else {
              $('#login').show();
              $('#loggedin').hide();
          }

          //  Search Button Event Listener
          document.getElementById('search-form').addEventListener('submit', searchQuery);


          // Get playlists
          function searchQuery(event) {
            var query = document.getElementById("query").value;
            // var req = new XMLHttpRequest(); 
            var url = "https://api.spotify.com/v1/search?q=" + query + "&type=album";
            // req.open("GET", url, true);
            // req.setRequestHeader('Authorization': 'Bearer ' + access_token);
            // req.addEventListener('load', function() {
            //   if(req.status >= 200 && req.status < 400){
            //     var response = JSON.parse(req.responseText);
            //     // console.log(response);
            //     displayPlaylist(response);
            //   } else {
            //       console.log("Error in network request: " + req.statusText);
            //   }
            // });
            
            // Change ajax to jquery due to API oauth req change
            $.ajax({
                    url: url,
                    headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                    data: {
                        q: query,
                        type: 'album'
                    },
                    success: function (response) {
                        displayAlbums(response);
                        console.log(response);
                    }
                });

            // req.send(null);
            event.preventDefault();
          } 

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
          
      
        // Add event listener to login button
          document.getElementById('login-button').addEventListener('click', function() {

            var client_id = '6ce6626a1a9147248f643d01f9da3092'; // Your client id
            var redirect_uri = 'http://web.engr.oregonstate.edu/~cisnejos/HowTo/getcontent.html'; // Your redirect uri
            // var redirect_uri = 'http://127.0.0.1:8080/getcontent.html'; // Your redirect uri

            var state = generateRandomString(16); // statekey

            localStorage.setItem(stateKey, state); // Store state key
            var scope = 'user-read-private user-read-email user-library-read playlist-read-private playlist-modify-public playlist-modify-private';

            var url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(client_id);
            url += '&scope=' + encodeURIComponent(scope);
            url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
            url += '&state=' + encodeURIComponent(state);

            // Redirect URL to make get request
            window.location = url;
          }, false);
        }
      })();

// //  Search Button Event Listener
// document.getElementById('search-form').addEventListener('submit', searchQuery);

// // Get Albums
// function searchQuery(event) {
// 	var query = document.getElementById("query").value;
// 	var req = new XMLHttpRequest(); 
// 	var url = "https://api.spotify.com/v1/search?q=" + query + "&type=album";
// 	req.open("GET", url, true);
// 	req.addEventListener('load', function() {
// 	  if(req.status >= 200 && req.status < 400){
// 	    var response = JSON.parse(req.responseText);
// 	    displayAlbums(response);
// 	  } else {
// 	      console.log("Error in network request: " + req.statusText);
// 	  }
// 	});
	
// 	req.send(null);
// 	event.preventDefault();
// }	

// // Append albums to div
// function displayAlbums(object) {
// 	var albumArray = object.albums.items;
// 	var results = document.getElementById("results");
// 	while (results.firstChild) {
// 	  results.removeChild(results.firstChild);
// 	}
// 	for (var i = 0; i < albumArray.length; i++) {	
// 		var image = document.createElement("IMG");
// 		image.className = "cover";
// 		image.setAttribute("src", albumArray[i].images[0].url );
// 		results.appendChild(image);
// 	}
// }

