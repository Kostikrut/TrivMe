import { FETCH_URL } from "./config.js";
import { constructUrl } from "./config.js";
import { NUM_QUES } from "./config.js";
import { QUES_TIME } from "./config.js";
import { getJson } from "./helpers.js";
import {} from "./config.js";
import { testBoard } from "./helpers.js"; // test data.

// list of scores.
export let scoreBoard = [...testBoard];

// state options object of current player.
export const state = {
  nickname: "",
  difficulty: 0,
  category: 0,
  questions: [],
  score: 0,
  selected: false,
  questionIndex: 0,
  answered: 0,
};

// clearing state object.
export const clearState = function () {
  state.nickname = "";
  state.difficulty = 0;
  state.category = 0;
  state.questions = [];
  state.score = 0;
  state.selected = false;
  state.questionIndex = 0;
  state.answered = 0;
};

// function gets selected fields data and inserts it to state
export const checkData = function (obj) {
  // if there is no nickname
  if (!obj.nickname || obj.nickname.length > 15) return false;
  state.nickname = obj.nickname;

  if (obj.difficulty === "easy") state.difficulty = 10;
  if (obj.difficulty === "medium") state.difficulty = 12;
  if (obj.difficulty === "hard") state.difficulty = 15;
  if (obj.difficulty === "any") state.difficulty = 13;
  if (obj.category === "any") state.category = 1;

  constructUrl(obj.category, obj.difficulty);
  return true;
};

// shuffles the answersd and sends it to the controller.
export const getQuestion = function () {
  // state.selected = false; // slected answer returns to default state.

  const questionIndex = state.questionIndex; // index of current question.

  //if the question are ended return 'false' to the controller.
  if (questionIndex === NUM_QUES) {
    state.questionIndex = 0;
    return false;
  }

  // getting the question and answers
  const question = state.questions[questionIndex].question;
  const correct = state.questions[questionIndex].correct_answer;
  const incorrect = state.questions[questionIndex].incorrect_answers;

  // shuffling the answers
  const arrShuffle = shuffleQuestions([correct, ...incorrect]);
  state.questionIndex++; // updates question index for th enext question rendering.

  // sends shuffled array, question and question-index to controller.
  return { arrShuffle, question, questionIndex };
};

// check if the selected answer is correct.
export const checkAnswer = function (answer) {
  // gets the correct answer before 'state.questionIndex++; (l-49)'
  const correct = state.questions[state.questionIndex - 1].correct_answer;

  if (answer === correct) {
    state.score += state.difficulty;
    state.score += state.category;
    state.answered += 1;

    return true;
  }

  if (answer !== correct) {
    return false;
  }
};

// fetching the data and filling the state.question array.
export const fetchQuestions = async function () {
  const results = await getJson(FETCH_URL);
  state.questions = [...results];
};

// The function recieves answers and randomly shuffles them
export const shuffleQuestions = function (arr) {
  // shuffling array algorithm
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
};

// saves scores co local storage api
export const setLocalStorage = function () {
  localStorage.setItem("scores", JSON.stringify(scoreBoard));
};

// retrieve score from local storage and insert them to scoreboard.
export const getLocallStorage = function () {
  const scores = JSON.parse(localStorage.getItem("scores"));

  if (scores) scoreBoard = scores;
  else return;
};

// removing the scores from local storage
// localStorage.removeItem("scores");
