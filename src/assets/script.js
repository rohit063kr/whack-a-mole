const config = {
  easy: {
    moleInHoleSec: 1,
    time: 60,
  },
  medium: {
    moleInHoleSec: .7,
    time: 20,
  },
  hard: {
    moleInHoleSec: .5,
    time: 10,
  }
};

const highScores = {
  easy: 20,
  medium: 210,
  hard: 310,
}


const board = document.querySelector('.box__main');
const scoreEl = document.querySelector('.score');
const highScoreEl = document.querySelector('.high-score');
const timerEl = document.querySelector('.timer');

const overlay = document.querySelector('.overlay');
const popup = document.querySelector('.popup');

const startBtn = document.querySelector('.btn__start');
const endBtn = document.querySelector('.btn__end');
const popupBtn = document.querySelector('.popup__btn');

const difficulty = document.querySelector('.popup__select');

const moleHoles = Array.from(document.querySelectorAll('.box__sub'));

let TIME,MOLE_IN_HOLE_SEC,timer, moleInterval;

// Config
// const MOLE_IN_HOLE_SEC = 1; // In seconds
// let TIME = 10; // In seconds

const Game = class {
  _score = 0;
  _highScore = 0;
  _config;

  constructor(){
    difficulty.addEventListener('change', this._showScore.bind(this));

    popupBtn.addEventListener('click', this._closePopup.bind(this));

    startBtn.addEventListener('click', this._startGame.bind(this));

    endBtn.addEventListener('click', this._endGame.bind(this));
  }

  _startGame(){
    if(timer) this._endGame();

    this._init();

    this._addMoleOutInterval();
    this._addMoleCaughtEvent();
    this._startTimer();
  }

  _endGame(){
    if(this._score > this._highScore) this._saveGame();

    window.location.reload();
    popup.prepend('<h3>Restart the game</h3>')
  }

  _init(){
    TIME = this._config.time;
    MOLE_IN_HOLE_SEC = this._config.moleInHoleSec;
    this._score = 0;

    this._loadGame();

    time = TIME;
    timerEl.textContent = this._formatTime(time);
    scoreEl.textContent = this._score;
    highScoreEl.textContent = this._highScore;
  }

  _formatTime(time) {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);
    return `${min}:${sec}`
  }

  _random(min, max){
    return Math.trunc(Math.random() * (min + max - min)) + min
  }

  _vanishMole(){
    moleHoles.forEach(el => {
      if (el.classList.contains('box__active'))
        el.classList.remove('box__active')
    })
  }

  _callMole(){
    const randomHoleNum = this._random(0 ,moleHoles.length - 1);
    moleHoles[randomHoleNum].classList.add('box__active');
  }

  _caughtMole(e){
    if(!e.target.classList.contains('box__active')) return;

    this._score++;
    scoreEl.textContent = this._score;
  }

  _addMoleOutInterval() {
    moleInterval = setInterval(() => {
      this._vanishMole();
      this._callMole();
    }, MOLE_IN_HOLE_SEC * 1000);
  }

  _startTimer(){
    timer = setInterval(() => {

      time--;
      timerEl.textContent = this._formatTime(time);

      if(!time) {
        this._endGame.call(this);
      };
    }, 1000)
  }

  _addMoleCaughtEvent(){
    board.addEventListener('click', this._caughtMole.bind(this));
  }

  _removeMoleCaughtEvent(){
    board.removeEventListener('click', this._caughtMole);
  }

  _saveGame(){
    this._highScore = this._score;

    localStorage.setItem('wackTheMole', JSON.stringify(this._highScore));
  }

  _loadGame(){
    const data = JSON.parse(localStorage.getItem('wackTheMole'));

    if(data) this._highScore = +data;
  }

  _closePopup() {
    overlay.classList.add('hidden');
    popup.classList.add('hidden');

    if(difficulty.value === 'easy') this._config = config.easy;
    if(difficulty.value === 'medium') this._config = config.medium;
    if(difficulty.value === 'hard') this._config = config.hard;
    this._init();
  }

  _showScore(e){
    if(e.target.value === 'easy') this._highScore = highScores.easy;
    if(e.target.value === 'medium') this._highScore = highScores.medium;
    if(e.target.value === 'hard') this._highScore = highScores.hard;

    document.querySelector('.popup__high-score').textContent = this._highScore;
  }
};

new Game();
