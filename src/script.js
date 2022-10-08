const convertTime = (time) => {
  let mins = Math.floor(time / 60);
  let secs = Math.floor(time % 60);
  if (secs < 10) {
    secs = "0" + String(secs);
  }
  return mins + ":" + secs;
};

const footer = (name) => {
  return `<div class="flex items-center justify-between w-96 text-white">
  <img class="w-16 h-16 ml-2" src="../assets/img/default.png" alt="default">
  <div>
    <div class="marquee w-64">
      <p>${name}</p>
    </div>
    <p class="text-xs text-gray-300">Singer</p>
  </div>
  <span class="icon-heart hover:cursor-pointer text-gray-300 hover:text-white"></span>
</div>
<div class="flex flex-col justify-between w-96 h-16">
  <div class="flex justify-between text-gray-300 text-2xl items-center">
    <button class="icon-shuffle"></button>
    <button class="icon-previous2"></button>
    <button class="play-button icon-play3 text-slate-900 bg-gray-300 rounded-full p-2"></button>
    <button class="icon-next2"></button>
    <button class="icon-loop"></button>
  </div>
  <div class=" flex justify-between text-gray-300">
    <p class="timer">0:00</p>
    <input class="slider song-slider bg-slate-300 hover:cursor-pointer" type="range" value="0" min="0" max="100" step="1">
    <p class="duration">3:00</p>
  </div>
</div>
<div class="flex justify-between w-80 text-gray-300 text-2xl ">
  <span class="pl-8 icon-volume-medium"></span>
  <input class="volumen-slider slider bg-slate-300" type="range" value="100" min="0" max="100" step="1">
</div>`;
};

var count = 1;

const addSong = (name, audio) => {
  const grid = document.querySelector(".grid-container");

  const d = new Date();

  const audioDuration = convertTime(audio.duration);

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

  const playButton = document.createElement("button");
  playButton.className = "icon-play3 hover:opacity-50";

  playButton.addEventListener("click", () => {
    const footerDOM = document.querySelector("footer");
    footerDOM.innerHTML = footer(name);

    const playBtn = document.querySelector(".play-button");
    const progressEl = document.querySelector(".song-slider");
    const timer = document.querySelector(".timer");
    const duration = document.querySelector(".duration");
    const progressVol = document.querySelector(".volumen-slider");

    let mouseDownOnSlider = false;

    progressEl.value = 0;

    duration.innerHTML = audioDuration;

    audio.addEventListener("timeupdate", () => {
      if (!mouseDownOnSlider) {
        progressEl.value = (audio.currentTime / audio.duration) * 100;

        timer.innerHTML = convertTime(audio.currentTime);
      }
    });
    audio.addEventListener("ended", () => {
      playBtn.className =
        "play-button icon-play3 text-slate-900 bg-gray-300 rounded-full p-2";
    });
    playBtn.addEventListener("click", () => {
      audio.paused ? audio.play() : audio.pause();
      playBtn.className = audio.paused
        ? "play-button icon-play3 text-slate-900 bg-gray-300 rounded-full p-2"
        : "play-button icon-pause2 text-slate-900 bg-gray-300 rounded-full p-2";
    });

    progressEl.addEventListener("change", () => {
      const pct = progressEl.value / 100;
      audio.currentTime = (audio.duration || 0) * pct;
    });
    progressEl.addEventListener("mousedown", () => {
      mouseDownOnSlider = true;
    });
    progressEl.addEventListener("mouseup", () => {
      mouseDownOnSlider = false;
    });

    progressVol.addEventListener("input", (e) => {
      audio.volume = e.currentTarget.value / 100;
    });
  });

  const editButton = document.createElement("button");
  editButton.className = "icon-pencil hover:opacity-50";

  const deleteButton = document.createElement("button");
  deleteButton.className = "icon-bin hover:opacity-50";

  const actionsContainer = document.createElement("div");
  actionsContainer.className = "space-x-2";

  actionsContainer.appendChild(playButton);
  actionsContainer.appendChild(editButton);
  actionsContainer.appendChild(deleteButton);

  grid.innerHTML =
    grid.innerHTML +
    `<p>${count++}</p>
  <div class="flex col-span-2 space-x-3 items-center">
    <img class="w-10 h-10" src="../assets/img/default.png" alt="">
    <h5 class="truncate">${name}</h5>
  </div>
  <p>${date}</p>
  <p>${audioDuration}</p>`;

  grid.appendChild(actionsContainer);
};

function changeHandler({ target }) {
  // Make sure we have files to use
  if (!target.files.length) return;

  const songName = target.files[0].name.split(".")[0];

  // Create a blob that we can use as an src for our audio element
  const urlObj = URL.createObjectURL(target.files[0]);

  //if (audio !== undefined) {
    //audio.pause();
  //}
  const audio = new Audio(urlObj);

  audio.addEventListener("loadeddata", () => {
    addSong(songName, audio);
  });
}

document
  .getElementById("audio-upload")
  .addEventListener("change", changeHandler);
