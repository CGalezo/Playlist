var count = 1;

function changeHandler({ target }) {
  const d = new Date();

  const months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };
  const date = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  // Make sure we have files to use
  if (!target.files.length) return;

  // Create a blob that we can use as an src for our audio element
  const urlObj = URL.createObjectURL(target.files[0]);

  // Create an audio element
  const audio = document.createElement("audio");
  audio.className = "col-span-2";

  // Clean up the URL Object after we are done with it
  audio.addEventListener("load", () => {
    URL.revokeObjectURL(urlObj);
  });

  const songs = document.querySelector(".songs");
  songs.textContent = count + (count == 1 ? " song" : " songs");

  // Append the audio element
  const playlist = document.querySelector(".grid-container");
  playlist.innerHTML =
    playlist.innerHTML +
    `<p>${count++}</p>
  <div class="flex col-span-2 space-x-3 items-center">
  <img class="w-10 h-10" src="../assets/img/default.png" alt="">
  <div class="truncate w-64">${target.files[0].name}</div>
  </div>
  <p>${date}</p>`;
  playlist.appendChild(audio);

  // Allow us to control the audio
  audio.controls = "true";

  // Set the src and start loading the audio from the file
  audio.src = urlObj;

  audio.addEventListener("loadeddata", () => {
    let h = Math.floor(audio.duration / 3600);
    let m = Math.floor((audio.duration % 3600) / 60);

    const hours = document.querySelector(".hours");
    const minutes = document.querySelector(".minutes");

    hours.textContent = h + parseInt(hours.textContent);
    minutes.textContent = m + parseInt(minutes.textContent);
  });
}

document
  .getElementById("audio-upload")
  .addEventListener("change", changeHandler);

const save = document.querySelector(".save-button");

save.addEventListener("click", (e) => {
  e.preventDefault();

  const name = document.querySelector(".playlist-name").value;
  const author = document.querySelector(".author").value;
  const description = document.querySelector(".description").value;

  const message = document.querySelector(".error-message");

  if (name === "") {
    message.textContent = "Invalid name";
  } else if (author === "") {
    message.textContent = "Invalid author";
  } else {

    count = 1;

    const grid = document.querySelector(".playlist-grid");
    grid.innerHTML = `<p class="font-bold col-span-1 text-white">#</p>
    <P class="font-bold col-span-2 text-white">TITLE</P>
    <p class="font-bold col-span-1 text-white">DATE ADDED</p>
    <p class="font-bold col-span-2 text-white">PLAY</p>`;

    const list_playlist = document.querySelector(".list-playlist");
    list_playlist.innerHTML =
      list_playlist.innerHTML + `<p class="mt-3">${name}</p>`;

    const nameDom = document.querySelector(".name-DOM");
    const authorDom = document.querySelector(".author-DOM");
    const descrptionDom = document.querySelector(".description-DOM");

    nameDom.textContent = name;
    authorDom.textContent = author;
    descrptionDom.textContent = description;

    const playlistForm = document.querySelector(".create-playlist");
    const playlist = document.querySelector(".playlist");

    playlistForm.className =
      "hidden create-playlist flex items-center justify-center w-5/6 bg-slate-800 rounded-lg";
    playlist.className =
      "playlist w-5/6 bg-slate-800 rounded-lg overflow-y-auto";

    document.querySelector(".playlist-name").value = "";
    document.querySelector(".author").value = "";
    document.querySelector(".description").value = "";
    message.textContent = "";
  }
});

const createButton = document.querySelector(".button-create-playlist");
createButton.addEventListener("click", () => {
  const playlistForm = document.querySelector(".create-playlist");
  const playlist = document.querySelector(".playlist");

  playlistForm.className =
    "create-playlist flex items-center justify-center w-5/6 bg-slate-800 rounded-lg";
  playlist.className =
    "hidden playlist w-5/6 bg-slate-800 rounded-lg overflow-y-auto";
});
