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
//     playerVars: { origin: "127.0.0.1:5500" }
    // videoId: "",
    // events: {
    // onReady: onPlayerReady
    // onStateChange: onPlayerStateChange
    // }
  });
}

/* Player Functions ============================================================================*/

// globals for back/next navigation + highlighting
var currentIndex = 0,
  sessionList;

// this function recieves a user-selected videoId to cue/play
function userAddEvent(id) {
  // retrieve relevant result object from hidden DOM p element
  var result = JSON.parse(document.getElementById(id).innerHTML);

  // placeholder for user-name (always optional)
  var user = "jim";

  // construct minimised active playlist
  document.querySelector("#session-list").insertAdjacentHTML(
    "beforeend",
    `<li class="highlight">
      <div class="thumbnail">
        <img src=${result.small}>
      </div>
      <div class="summary">
        <ul>
          <li><b>${result.title}</b></li>
          <li><em>Uploaded by ${result.channel} at ${result.date}</em></li>
          <li><strong>Added by ${user}</strong></li>
        </ul>
      </div>
    </li>`
  );

  sessionList = document.querySelectorAll(".highlight");
  if (sessionList.length === 1) {
    console.log("only one added video --> cue now");
    player.cueVideoById(id);
    // set first highlight
    sessionList[currentIndex].style.backgroundColor = "yellow";
  } else {
    console.log("at least 2 added videos --> don't cue");
  }

  // condition for playing / cueing
  // if ( session-list has only one li) {
  // cue it immediately
  // } else {
  // append ID to custom/API-based playlist
  // this list must know the id to use and the <li> it relates to...
  // }
}

/* From prototype (main.js) ====================================================================*/

// handle back / next commands
function navigation(cmd) {
  // refresh array of session-list results
  sessionList = document.querySelectorAll(".highlight");
  if (cmd === "next") {
    // set currentURL index in a loop and update playlist highlighting
    if (currentIndex === sessionList.length - 1) {
      currentIndex = 0;
      sessionList[sessionList.length - 1].style.backgroundColor = "transparent";
      sessionList[currentIndex].style.backgroundColor = "yellow";
    } else {
      currentIndex++;
      sessionList[currentIndex - 1].style.backgroundColor = "transparent";
      sessionList[currentIndex].style.backgroundColor = "yellow";
    }
  } else if (cmd === "back") {
    // set currentIndex index in a loop and update playlist highlighting
    if (currentIndex === 0) {
      currentIndex = sessionList.length - 1;
      sessionList[0].style.backgroundColor = "transparent";
      sessionList[currentIndex].style.backgroundColor = "yellow";
    } else {
      currentIndex--;
      sessionList[currentIndex + 1].style.backgroundColor = "transparent";
      sessionList[currentIndex].style.backgroundColor = "yellow";
    }
  } else {
    console.log("navigation function recieved an unknown command");
  }
}

document.querySelector("#next").addEventListener("click", function() {
  navigation("next");
});

document.querySelector("#back").addEventListener("click", function() {
  navigation("back");
});

/* From YouTube API ============================================================================*/

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
