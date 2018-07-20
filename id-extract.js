// broad youtube id-extractor for https://stackoverflow.com/a/27728417

// Just the regex. Output is in r[1]
/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

let i, r;
const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

// load id from user submitted value
document.querySelector("#submit").addEventListener("click", function() {
  let url = document.querySelector("#url").value;
  r = url.match(rx);
  // can now return r[1] to { firebase : DOM playlist : iframe player queue }
  console.log(r[1]);

  gapi.client.youtube.search
    .list({
      q: r[1],
      part: "snippet",
      maxResults: "1",
      type: "video",
      videoEmbeddable: true
    })
    .then(
      // populate #search-container with single video result
      function(response) {
        // empty old search results if there are any
        emptyResults();

        // create custom result object
        var result = {};

        // populate custom result object
        result.title = response.result.items[0].snippet.title;
        result.desc = response.result.items[0].snippet.description;
        result.channel = response.result.items[0].snippet.channelTitle;
        result.date = response.result.items[0].snippet.publishedAt.slice(0, 10);
        result.small = response.result.items[0].snippet.thumbnails.default.url;
        result.img = response.result.items[0].snippet.thumbnails.medium.url;
        result.id = response.result.items[0].id.videoId;

        // pass result object to html constructor
        new SearchResult(result);
      },
      function(reason) {
        console.log("search error: " + reason.result.error.message);
      }
    );
});

/*=============================================================================*/

// for (i = 0; i < urls.length; ++i) {
//   r = urls[i].match(rx);
//   console.log(r[1]);
// }
