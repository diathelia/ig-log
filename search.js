/* this script loads the youtube search API and configures the page */

function start() {
  // 2. Initialize the JavaScript client library
  gapi.client
    .init({
      apiKey: "AIzaSyB_oIhkzTzNLv3lAF5uNqrG31fgZZ4SVjg"
    })
    .then(function() {
      // 3. Initialize and make the API request
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

// empty old search results if there are any
function emptyResults() {
  if (document.querySelector("#search-list").innerHTML !== "") {
    console.log("emptying...");
    document.querySelector("#search-list").innerHTML = "";
  }
}

// Search for a specified string on click
function search() {
  // empty old search results if there are any
  emptyResults();

  // get new query
  var q = $("#query").val();

  gapi.client.youtube.search
    .list({
      q: q,
      part: "snippet",
      maxResults: "10",
      type: "video",
      videoEmbeddable: true
    })
    .then(function(response) {
      // console.log(JSON.stringify(response.result, null, "\t"));

      // populate #search-container with list of results
      response.result.items.forEach(
        function(item) {
          // create custom result object
          var result = {};
          // populate custom result object
          result.title = item.snippet.title;
          result.desc = item.snippet.description;
          result.channel = item.snippet.channelTitle;
          result.date = item.snippet.publishedAt.slice(0, 10);
          result.small = item.snippet.thumbnails.default.url;
          result.img = item.snippet.thumbnails.medium.url;
          result.id = item.id.videoId;

          // pass result object to html constructor
          new SearchResult(result);
        },
        function(reason) {
          console.log("search error: " + reason.result.error.message);
        }
      );
    });
}

// search result constructor
function SearchResult(result) {
  // stringify entire result object to hide inside a <p> id attribute
  var resultString = JSON.stringify(result);

  // append results to list
  document.querySelector("#search-list").insertAdjacentHTML(
    "beforeend",
    // line 103 note: this.id is a DOM node value to easily match resultString
    `<li class="searchLi">
    <p id="${result.id}" style="display:none">${resultString}</p>
      <div class="thumbnail">
        <img src=${result.img}>
      </div>
      <div class="summary">
        <ul>
          <li><button class="add-url" id="${
            result.id
          }" onclick="userAddEvent(this.id)">Add To Playlist</li>
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

// 1. Load the JavaScript client library
gapi.load("client", {
  callback: function() {
    // Handle gapi.client initialization
    start();
  },
  onerror: function() {
    // Handle loading error
    console.log("gapi.client failed to load!");
  },
  timeout: 5000, // 5 seconds
  ontimeout: function() {
    // Handle timeout
    console.log("gapi.client could not load in a timely manner!");
  }
});
