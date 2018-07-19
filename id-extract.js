// broad youtube id-extractor for https://stackoverflow.com/a/27728417

// Just the regex. Output is in r[1]
/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

let i, r;
const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

document.querySelector("#submit").addEventListener("click", () => {
  let url = document.querySelector("#url").value;
  r = url.match(rx);
  console.log(r[1]);
  // can now return r[1] to { firebase : DOM playlist : iframe player queue }
});

/*=============================================================================*/

// for (i = 0; i < urls.length; ++i) {
//   r = urls[i].match(rx);
//   console.log(r[1]);
// }
