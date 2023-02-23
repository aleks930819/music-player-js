const shuffleBtn = document.querySelector('.player__controls__btn--shuffle');
const prevBtn = document.querySelector('.player__controls__btn--prev');
const playBtn = document.querySelector('.player__controls__btn--play');
const nextBtn = document.querySelector('.player__controls__btn--next');
const repeatBtn = document.querySelector('.player__controls__btn--repeat');
const volumeIcon = document.querySelector('.player__volume__icon');
const songPicker = document.querySelector('.player__song__picker__btn');
const songPickerList = document.querySelector( '.player__song__picker__music-list');

const body = document.querySelector('body');

const title = document.querySelector('.player__info__details__title');
const artist = document.querySelector('.player__info__details__artist');

const currentTrack = document.createElement('audio');

const songs = [
  {
    id: 0,
    img: './assets/images/skyfall.jpg',
    title: 'Skyfall',
    artist: 'Adele',
    audio: './assets/music/skyfall.mp3',
  },
  {
    id: 1,
    img: './assets/images/desertrose.jpg',
    title: 'Desert Rose',
    artist: 'Sting',
    audio: './assets/music/desertrose.mp3',
  },

  {
    id: 2,
    img: './assets/images/staywithme.png',
    title: 'Stay With Me',
    artist: 'Sam Smith',
    audio: './assets/music/staywithme.mp3',
  },
  {
    id: 3,
    img: './assets/images/mishamarvin.jpg',
    title: 'Французский Поцелуй',
    artist: 'Misha Marvins',
    audio: './assets/music/mishamarvin.mp3',
  },
];

const currentTimeOfTheSong = document.querySelector(
  '.player__progress__bar__curent-time'
);
const durationOfTheSong = document.querySelector(
  '.player__progress__bar__duration'
);
const progressBar = document.querySelector('.player__progress__bar__input');

const cover = document.querySelector('.player__info__img');
const volume = document.querySelector('.player__volume__bar__input');
const audio = document.querySelector('.player__audio');
const albumCover = document.querySelector('.album__cover');

let trackIndex = 0;

let muted = false;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isClicked = false;
let timer;

playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
repeatBtn.addEventListener('click', repeatSong);
shuffleBtn.addEventListener('click', shuffleSongs);
volumeIcon.addEventListener('click', mute);
songPicker.addEventListener('click', pickSong);

function loadSong(trackIndex) {
  clearInterval(timer);
  resetValues();
  console.log('runing');

  title.textContent = songs[trackIndex].title;
  artist.textContent = songs[trackIndex].artist;
  albumCover.src = songs[trackIndex].img;
  currentTrack.src = songs[trackIndex].audio;
  currentTrack.load();

  timer = setInterval(updateProgressBar, 1000);
  changeBodyBackground();
}

function resetValues() {
  currentTimeOfTheSong.textContent = '00:00';
  durationOfTheSong.textContent = '00:00';
  progressBar.value = 0;
}

function updateProgressBar() {
  if (currentTrack.duration) {
    const progress = Math.round(
      (currentTrack.currentTime / currentTrack.duration) * 100
    );
    progressBar.value = progress;
    currentTimeOfTheSong.textContent = getFormattedTime(
      currentTrack.currentTime
    );
    durationOfTheSong.textContent = getFormattedTime(currentTrack.duration);
  }
}

function getFormattedTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
}

function playSong() {
  changeBodyBackground();

  const icon = playBtn.querySelector('i.fas');
  isPlaying = true;
  icon.classList.replace('fa-play', 'fa-pause');
  currentTrack.play();
}

function pauseSong() {
  const icon = playBtn.querySelector('i.fas');
  isPlaying = false;
  icon.classList.replace('fa-pause', 'fa-play');
  currentTrack.pause();
}

function prevSong() {
  trackIndex--;
  if (trackIndex < 0) {
    trackIndex = songs.length - 1;
  }
  loadSong(trackIndex);
  playSong();
}

function nextSong() {
  trackIndex++;
  if (trackIndex > songs.length - 1) {
    trackIndex = 0;
  }
  loadSong(trackIndex);
  playSong();
}

function repeatSong() {
  if (isRepeat) {
    isRepeat = false;
    repeatBtn.classList.remove('active');
  } else {
    isRepeat = true;
    repeatBtn.classList.add('active');
  }

  let currentIndex = trackIndex;
  loadSong(currentIndex);
  playSong();
}

function shuffleSongs() {
  if (isShuffle) {
    isShuffle = false;
    shuffleBtn.classList.remove('active');
  } else {
    isShuffle = true;
    shuffleBtn.classList.add('active');
  }
  let randomIndex = Math.floor(Math.random() * songs.length);
  let currentIndex = randomIndex;
  loadSong(currentIndex);
  playSong();
  changeBodyBackground();
}

function goTo() {
  let goTo = currentTrack.duration * (progressBar.value / 100);
  currentTrack.currentTime = goTo;
}

function setVolume() {
  currentTrack.volume = volume.value / 100;
}

function mute() {
  const icon = volumeIcon.querySelector('i.fas');

  if (muted) {
    icon.classList.replace('fa-volume-mute', 'fa-volume-up');
    currentTrack.muted = false;
    volume.value = 100;
    muted = false;
  } else {
    icon.classList.replace('fa-volume-up', 'fa-volume-mute');
    currentTrack.muted = true;
    volume.value = 0;
    muted = true;
  }
}

function pickSong(e) {
  isClicked = !isClicked;

  if (isClicked) {
    songPickerList.classList.add('visible');
    songPickerList.innerHTML = '';
    songs.forEach((song, index) => {
      const songItem = document.createElement('div');
      songItem.classList.add('song-picker__list__item');
      songItem.dataset.index = index;
      songItem.innerHTML = `
      <div class="song-picker__list__item__info" id=${song.id}>
        <p class="song-picker__list__item__info__number">${index + 1}</p>
        <h3 class="song-picker__list__item__info__title">${song.title}</h3>
        <p class="song-picker__list__item__info__artist">${song.artist}</p>
      </div>
    `;

      songPickerList.appendChild(songItem);
    });
  } else {
    songPickerList.classList.remove('visible');
  }

  const songItems = document.querySelectorAll('.song-picker__list__item__info');
  songItems.forEach((songItem) => {
    songItem.addEventListener('click', (e) => {
      const songIndex = e.target.closest('.song-picker__list__item').dataset
        .index;
      trackIndex = songIndex;
      loadSong(trackIndex);
      playSong();
      songPickerList.classList.remove('visible');
      isClicked = false;
    });
  });
}

function changeBodyBackground() {
  document.body.style.backgroundImage = `url(${songs[trackIndex].img})`;
}

loadSong(trackIndex);
