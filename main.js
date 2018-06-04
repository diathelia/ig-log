// Initialize Firebase
var config = {
    apiKey: "AIzaSyB_oIhkzTzNLv3lAF5uNqrG31fgZZ4SVjg",
    authDomain: "playlist-remote.firebaseapp.com",
    databaseURL: "https://playlist-remote.firebaseio.com",
    projectId: "playlist-remote",
    storageBucket: "",
    messagingSenderId: "92127960634"
};

firebase.initializeApp(config);

    // reference to appends collection
var appendsRef = firebase.database().ref('appends'),
    // playlist DOM node
    reqList    = document.querySelector('#reqList'),
    // global array for embeddable URL playlist
    embedURLs  = [],
    // current URL counter
    currentURL = 0,
    // array of playlist <a> nodes
    linkItems;

/* Playlist Functions ====================================================================================================*/

// cleans node value to get URL
function getURL(value) {
    var item = JSON.stringify(value.append),
        url  = item.slice(1, -1);
    return url;
}

// change cleaned URL to embeddable URL
function embeddableURL(URL) {
    var part1 = URL.slice(0, 24),
        part2 = URL.slice(32),
        embedURL = part1 + 'embed/' + part2;
    return embedURL;
}

// populates list and listens for any more appends
appendsRef.on('child_added', function(snapshot) {

    var url = getURL(snapshot.val()),
        li  = document.createElement('li');
    
    li.innerHTML = '<a class="url-item" href="' + url + '">' + url + '</a>';
    reqList.appendChild(li);

}, function(e){
    console.log(e);
});

// create youtube player and add first item
document.querySelector('#play').addEventListener('click', function() {

    // set this global to an array of <a> classes (the playlist)
    linkItems = document.querySelectorAll('.url-item');

    // set first playlist highlight
    linkItems[currentURL].style.backgroundColor = 'yellow';

    // populate global embeddable array
    linkItems.forEach(function(item) {
        embedURLs.push(embeddableURL(item.innerHTML));
    });

    // create youtube iframe with an id to change src via properties, set to first URL for now
    document.querySelector('#player-wrap').innerHTML =
    '<iframe id="player" controls frameborder="0" allowfullscreen width="420" height="315" src="'+
    embedURLs[0]+'"></iframe>';
});

// play next item
document.querySelector('#next').addEventListener('click', function() {

    // call navigation function
    navigation('next');

    // update src
    document.querySelector('#player').setAttribute('src', embedURLs[currentURL]);
});

// play previous item
document.querySelector('#prev').addEventListener('click', function() {

    // call navigation function
    navigation('prev');

    // update src
    document.querySelector('#player').setAttribute('src', embedURLs[currentURL]);
});

// function to handle previous / next navigations by updating the currentURL global & css
function navigation(cmd) {
    if (cmd === 'next') {
        // set currentURL index in a loop and update playlight highlighting
        if (currentURL === linkItems.length-1) {
            currentURL = 0;
            linkItems[linkItems.length-1].style.backgroundColor = 'transparent';
            linkItems[currentURL].style.backgroundColor = 'yellow';
        } else {
            currentURL++;
            linkItems[currentURL-1].style.backgroundColor = 'transparent';
            linkItems[currentURL].style.backgroundColor = 'yellow';
        }
    } else if (cmd === 'prev') {
        // set currentURL index in a loop and update playlight highlighting
        if (currentURL === 0) {
            currentURL = linkItems.length-1;
            linkItems[0].style.backgroundColor = 'transparent';
            linkItems[currentURL].style.backgroundColor = 'yellow';
        } else {
            currentURL--;
            linkItems[currentURL+1].style.backgroundColor = 'transparent';
            linkItems[currentURL].style.backgroundColor = 'yellow';
        }
    } else {
        console.log('navigation function recieved an unknown command');
    }
}

/* Form Submission ========================================================================================================*/

// listen for form submit
document.querySelector('#form').addEventListener('submit', submitForm);

// function called on submit
function submitForm(e) {
    e.preventDefault();

    // get value(s)
    var append = inputVal('append');

    // save append request to firebase as an object 
    saveAppend(append);

    // Show alert
    document.querySelector('.alert').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function(){
        document.querySelector('.alert').style.display = 'none';
    }, 3000);

    // reset inputs
    document.querySelector('#form').reset();
}

// function to get form value(s) by <input> id
function inputVal(id) {
    return document.getElementById(id).value;
}

// save append request to firebase
function saveAppend(append) {
    var newAppendRef = appendsRef.push();
    
    newAppendRef.set({
        append: append
    });
}