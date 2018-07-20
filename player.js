/* this script handles the youtube iframe player API and session playlist */

/*
  * throw player to screen idea:
  * detect innerWidth on every new init, try find biggest screen to
  * isolate/throw player to. develop voting / vetoing / deciding
  * functionality --> more interactive, more game-like. could head
  * toward a mini-game + youtube messaround-platform in long term
  * 
  * player.loadVideoById(); // TYLER, THE CREATOR - BRONCO;
  * player.loadVideoById({ videoId: "pQlbCbD7hgM" });
*/

/* Load iframe API =============================================================================*/

// 2. This code loads the IFrame Player API code asynchronously.
const tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    playerVars: { origin: "127.0.0.1:5500" } // LOCALS ONLY
    // videoId: "",
    // events: {
    // onReady: onPlayerReady
    // onStateChange: onPlayerStateChange
    // }
  });
}

/* Player Functions ============================================================================*/

// sessionList[currentIndex] and sessionIds[idIndex] are synced such that
// navigation and user selection of session videos stays accurate (no state tho)

// keeps track of currently highlighted video
var currentIndex = 0,
  // querySelectorAll array target of highlight-able <li>
  sessionList,
  // array of videoId's
  sessionIds = [];
// custom index for ordering sessionIds
var idIndex = 0;

// this function recieves a user-selected videoId from search.js to cue/play
function userAddEvent(DOMid) {
  // retrieve relevant result string and object from hidden DOM p element
  var resultString = document.getElementById(DOMid).innerHTML,
    // ...could be bad design forcing this fix, or a decent way to seperate
    // the two playlists which don't truly have much in common beyond 'add'
    result = JSON.parse(resultString);

  // update array of videoId's with result object
  sessionIds.push(result.id);

  // placeholder for user-name (always optional)
  var user = "jim";

  // construct minimised active playlist
  document.querySelector("#session-list").insertAdjacentHTML(
    "beforeend",
    `<li class="highlight" onclick="playRequest(${idIndex})">
      <div class="thumbnail">
        <img src=${result.small}>
      </div>
      <div class="summary">
        <ul>
          <li><b>${result.title}</b></li>
          <li><strong>Added by ${user}</strong></li>
        </ul>
      </div>
    </li>`
  );

  // update id index
  idIndex++;

  // update sessionList array count
  sessionList = document.querySelectorAll(".highlight");

  // use to determine highlighting and cueing
  if (sessionList.length === 1) {
    player.cueVideoById(result.id);
    // set first highlight
    sessionList[currentIndex].style.backgroundColor = "yellow";
  }
}

// eventually this will handle play requests as voting if multiplayer
// @param = currentIndex or idIndex minus one (userAddEvent function must increment this list index)
function playRequest(index) {
  // if single user --> allow request
  // if multi-user  --> init vote();
  // @assume multi-user

  // get videoId with @param index (if idIndex, )
  player.loadVideoById(sessionIds[index]);

  // clear previous highlight with...currentIndex?
  sessionList[currentIndex].style.backgroundColor = "transparent";

  // update currentIndex with @param index
  currentIndex = index;

  // add new highlight with currentIndex
  sessionList[currentIndex].style.backgroundColor = "yellow";
}

/* From prototype (main.js) ====================================================================*/

// handle back / next navigation cmds with first-and-last list item handling
function navigation(cmd) {
  // refresh array of session-list results
  sessionList = document.querySelectorAll(".highlight");

  if (cmd === "next") {
    // if currentIndex is last item
    if (currentIndex === sessionList.length - 1) {
      // set to first item
      currentIndex = 0;
      sessionList[sessionList.length - 1].style.backgroundColor = "transparent";
      sessionList[currentIndex].style.backgroundColor = "yellow";
    } else {
      // increment
      currentIndex++;
      sessionList[currentIndex - 1].style.backgroundColor = "transparent";
      sessionList[currentIndex].style.backgroundColor = "yellow";
    }
  } else if (cmd === "back") {
    // if currentIndex is first item
    if (currentIndex === 0) {
      // set to last item
      currentIndex = sessionList.length - 1;
      sessionList[0].style.backgroundColor = "transparent";
      sessionList[currentIndex].style.backgroundColor = "yellow";
    } else {
      // decrement
      currentIndex--;
      sessionList[currentIndex + 1].style.backgroundColor = "transparent";
      sessionList[currentIndex].style.backgroundColor = "yellow";
    }
  } else {
    // complain
    console.log("navigation function received an unknown command");
  }

  // load videoId using updated currentIndex
  playRequest(currentIndex);
  // player.loadVideoById(sessionIds[currentIndex]);
}

document.querySelector("#next").addEventListener("click", function() {
  // check for meaningless call (--> block buttons later on)
  if (sessionList) {
    navigation("next");
  } else {
    console.log("no playlist exists to navigate");
  }
});

document.querySelector("#back").addEventListener("click", function() {
  // check for meaningless call (--> block buttons later on)
  if (sessionList) {
    navigation("back");
  } else {
    console.log("no playlist exists to navigate");
  }
});

/* From YouTube API ============================================================================*/

// function testFunction(element) {
//   // if values match, that sessionIds index is the videos place in the playlist
//   if (element === videoId) {
//     return element;
//   } else {
//     return "else";
//   }
// }

// 4. The API will call this function when the video player is ready.
// function onPlayerReady() {
// event.target.playVideo();
// }

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// let done = false;
// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     setTimeout(stopVideo, 6000);
//     done = true;
//   }
// }

// function stopVideo() {
//   player.stopVideo();
// }

// {
//   "title":"The Savitsky Cats: Super Trained Cats Perform Exciting Routine - America's Got Talent 2018",
//   "desc":"The talented felines and their trainers from Ukraine impress on the AGT stage. » Get The America's Got Talent App: http://bit.ly/AGTAppDownload » Subscribe for ...",
//   "channel":"America's Got Talent",
//   "date":"2018-05-30",
//   "small":"https://i.ytimg.com/vi/8e0z3-iZ_TY/default.jpg",
//   "img":"https://i.ytimg.com/vi/8e0z3-iZ_TY/mqdefault.jpg",
//   "id":"8e0z3-iZ_TY"
// }
