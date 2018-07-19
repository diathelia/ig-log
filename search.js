/* this script loads the youtube search API and configures the page
 *
 * next I need to properly connect search.js <--> player.js so that
 * the player functions are available in the same namespace as the
 * videoId values that are selected by the user
 * 
 * idea:
 * detect innerWidth on every new init, try find biggest screen to
 * isolate/throw player to. develop voting / vetoing / deciding
 * functionality --> more interactive, more game-like. could head
 * toward a mini-game + youtube messaround-platform in long term
 * 
 * player.loadVideoById(); // TYLER, THE CREATOR - BRONCO;
 * player.loadVideoById({ videoId: "pQlbCbD7hgM" });
 * 
 * does this have any ES6? {promises and ``}...MAKE IT ALL ES6 THEN.
 */

function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client
    .init({
      apiKey: "AIzaSyB_oIhkzTzNLv3lAF5uNqrG31fgZZ4SVjg"
    })
    .then(function() {
      // 3. Initialize and make the API request.
      // Load the client interfaces for the YouTube Analytics and Data APIs, which
      // are required to use the Google APIs JS client. More info is available at
      // https://developers.google.com/api-client-library/javascript/dev/dev_jscript#loading-the-client-library-and-the-api
      return gapi.client.load("youtube", "v3", function() {
        // After the API loads, call a function to enable the search box.
        $("#search-button").attr("disabled", false);
      });
    })
    .catch(function(error) {
      console.log("gapi client load error: ", error);
    });
}

// Search for a specified string on click
function search() {
  var q = $("#query").val();
  gapi.client.youtube.search
    .list({
      q: q,
      part: "snippet",
      maxResults: "10",
      type: "video",
      videoEmbeddable: true
    })
    .then(
      function(response) {
        // populate #search-container with list of results
        response.result.items.forEach(function(item) {
          // create custom result object
          var result = {};
          // populate custom result object
          result.title = item.snippet.title;
          result.desc = item.snippet.description;
          result.channel = item.snippet.channelTitle;
          result.date = item.snippet.publishedAt;
          result.small = item.snippet.thumbnails.default.url;
          result.img = item.snippet.thumbnails.medium.url;
          result.id = item.id.videoId;

          // clean date string
          result.date = result.date.slice(0, 10);

          // pass result object to html constructor
          new SearchResult(result);
        });

        // create array of search result buttons
        var addButtons = document.querySelectorAll(".add-url");
        addButtons.forEach(function(button) {
          // attach listeners to the array of buttons
          button.addEventListener("click", function() {
            // pass this result to player.js to cue/play
            userAddEvent(this.id);
            // note: 'this.id' is NOT an object.property --> it is the DOM buttons id attribute
          });
        });

        // var str = JSON.stringify(response.result, null, "\t");
      },
      function(reason) {
        console.log("search error: " + reason.result.error.message);
      }
    );
}

// search result constructor
function SearchResult(result) {
  // try hide entire result object inside button id as a string
  var resultString = JSON.stringify(result);

  // append results to list
  document.querySelector("#search-list").insertAdjacentHTML(
    "beforeend",
    `<li>
      <p id="${result.id}" style="display:none">${resultString}</p>
      <div class="thumbnail">
        <img src=${result.img}>
      </div>
      <div class="summary">
        <ul>
          <li><button class="add-url" id="${result.id}">Add To Playlist</li>
          <li><b>${result.title}</b></li>
          <li><em>${result.desc}</em></li>
          <li>Uploaded by ${result.channel} at ${result.date}</li>
          <li><a href="https://youtube.com/watch?v=${
            result.id
          }">Watch on YouTube</a></li>
        </ul>
      </div>
    </li>`
  );
}

// 1. Load the JavaScript client library.
gapi.load("client", {
  callback: function() {
    // Handle gapi.client initialization.
    start();
  },
  onerror: function() {
    // Handle loading error.
    console.log("gapi.client failed to load!");
  },
  timeout: 5000, // 5 seconds.
  ontimeout: function() {
    // Handle timeout.
    console.log("gapi.client could not load in a timely manner!");
  }
});
