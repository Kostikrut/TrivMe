import { state } from "./model.js";
import { clearState } from "./model.js";
import { fetchQuestions } from "./model.js";
import { getQuestion } from "./model.js";
import { checkData } from "./model.js";
import { checkAnswer } from "./model.js";
import { scoreBoard } from "./model.js";
import { setLocalStorage } from "./model.js";
import { getLocallStorage } from "./model.js";
import AppView from "./view.js";

// retrieves game settings and checks nickname field
const getCheckData = function (playAgain = false) {
  let data = {};
  let verifyData = "";

  if (playAgain) {
    // getting selected options from view
    data = AppView.getSelectedData();

    // check data and sets state object with game settings.
    verifyData = checkData(data); // sets state in model.
  }

  // if check data succeded - fetches&renders first question.
  if (verifyData) {
    AppView.clearDom();
    renderQuestion();
  }
};

// Self explanatory fn name :)
const renderQuestion = async function (newGame = false) {
  try {
    // if it is a new game - fetch data.
    if (!newGame) {
      await fetchQuestions(); // fetching questions from API
    }
    // gets the next question and index from model
    const results = getQuestion();

    if (!results) {
      // push nikname and score to score board array;
      renderScoreBoard();

      return;
    }

    // sending the shuffled data to the view
    AppView.renderQuestion(results, state.nickname, state.score);

    // set countdown timer if it is a new game
    if (!newGame) AppView.countdown(renderScoreBoard);

    // activate 'next question' button
    AppView.nextQuestion(renderQuestion);

    // check if the answer is correct.
    AppView.selectedAnswer(checkAnswer);
  } catch (err) {
    console.log(err.message);
  }
};

// Ends the game and renders the score board screen.
const renderScoreBoard = function () {
  scoreBoard.push({
    nickname: state.nickname,
    score: state.score,
    tag: "player",
  });
  // sort scoreboard
  scoreBoard.sort((a, b) => b.score - a.score);

  // render endgame dom
  renderEndgame();

  // remove player tag for further players.
  scoreBoard.forEach((obj) => (obj.tag = ""));

  setLocalStorage();
};

// render endgame DOm and display scoreboard.
const renderEndgame = function () {
  // display endgame screen
  AppView.renderEndgameDom(state.nickname, state.score, state.answered);

  // fill the score board with data.
  AppView.renderLogs(scoreBoard);

  // Activate btns...
  AppView.activateEndBtns(init, playAgain);
};

// Play again functionality (when the 'Play Again' btn is clicked).
const playAgain = function () {
  // remembering choises befoore clearing the state.
  const nickname = state.nickname;
  const difficulty = state.difficulty;
  const category = state.category;

  // clearing the state.
  clearState();

  // insering relevant state options to play again.
  state.nickname = nickname;
  state.difficulty = difficulty;
  state.category = category;

  renderQuestion();
};

const init = function () {
  getLocallStorage();
  clearState();
  AppView.renderMainDOM();
  AppView.startGame(getCheckData); // activates 'start game'-button and gets&checks game settings.
};
init();
