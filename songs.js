async function loadSongs() {
    const res = await fetch("songs.json");
    const songs = await res.json();
    renderSongList(songs);
}

function renderSongList(songs) {
    const list = document.getElementById("song-list");
    list.innerHTML = "";

    songs.forEach(song => {
        const li = document.createElement("li");
        li.textContent = song.title;
        li.onclick = () => showSong(song);
        list.appendChild(li);
    });
}

let currentAudio = null;

function showSong(song) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    document.getElementById("player").style.display = "block";

    const base = `songs/${song.folder}/`;
    const video = document.getElementById("video");
    const stimmenButtons = document.getElementById("stimmen-buttons");
    const content = document.getElementById("main-content");

    video.src = base + song.video;
    video.load();

    const firstMp3 = song.stimmen[0];
    const audio = new Audio(base + firstMp3);
    audio.preload = "auto";
    currentAudio = audio;

    video.addEventListener("play", () => {
        currentAudio.currentTime = video.currentTime;
        currentAudio.play();
    });

    video.addEventListener("pause", () => currentAudio.pause());
    video.addEventListener("seeked", () => {
        currentAudio.currentTime = video.currentTime;
    });

    video.addEventListener("ended", () => currentAudio.pause());

    stimmenButtons.innerHTML = "";
    song.stimmen.forEach((filename, index) => {
        const label = filename.replace(/^\d+ /, "").replace(".mp3", "");
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.onclick = () => switchVoice(base + filename, video.currentTime, btn);
        if (index === 0) btn.classList.add("active");
        stimmenButtons.appendChild(btn);
    });
}

function switchVoice(src, currentTime, buttonEl) {
    const video = document.getElementById("video");

    if (currentAudio) {
        currentAudio.pause();
    }

    currentAudio = new Audio(src);
    currentAudio.currentTime = currentTime;

    if (video.paused) {
        video.play();
        currentAudio.addEventListener("canplay", () => {
            currentAudio.play();
        }, {once: true});
    } else {
        currentAudio.play();
    }

    document.querySelectorAll("#stimmen-buttons button").forEach(btn => {
        btn.classList.remove("active");
    });
    buttonEl.classList.add("active");
}


loadSongs();