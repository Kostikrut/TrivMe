import { QUES_TIME } from "./config.js";
import { NUM_QUES } from "./config.js";

class AppView {
  #parentElement = document.querySelector(".app-container");

  clearDom() {
    this.#parentElement.innerHTML = "";
  }

  // the functio extracts game settings from pregame section (main page).
  getSelectedData() {
    const difficulty = document.querySelector(".select-dificulty").value;
    const category = document.querySelector(".category").value;
    const nickname = document.querySelector(".input-nickname").value;
    return { difficulty, category, nickname };
  }

  // render main screen
  renderMainDOM() {
    this.clearDom();
    const markup = this.#generateStarMarkup(); // gets html code for pregame page
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // start game btn activator.
  startGame(handler) {
    const startBtn = document.querySelector(".start-btn");
    startBtn.addEventListener("click", handler); // launches the 'getCheckData' fn from the controller
  }

  // render and display questio.
  renderQuestion(obj, nickname, score) {
    // const questionNum = obj.questionIndex;
    const question = obj.question;
    const answers = obj.arrShuffle;

    this.#parentElement.innerHTML = `
    <section class="status-section">
        <div class="status-nickname">${nickname}</div>
        <div class="status-score">Score:${score}</div>
        <div class="status-timer">timer</div>
      </section>
    <section class="game-section">
        <div class="question-container">

        </div>
        <button class="next-btn btn">Next</button>
      </section>
    `;
    const questContainer = document.querySelector(".question-container");

    questContainer.innerHTML = "";

    const markup = this.#generateQueMarkup(question, answers); // gets generated questions html
    questContainer.insertAdjacentHTML("afterbegin", markup); // implements the html on screen
  }

  // generates the questions HTML
  #generateQueMarkup(question, answers) {
    return `
    <div class="question">
    ${question}
    </div>
    <div class="answer" id="a0">${answers[0]}</div>
    <div class="answer" id="a1">${answers[1]}</div>
    <div class="answer" id="a2">${answers[2]}</div>
    <div class="answer" id="a3">${answers[3]}</div>
    `;
  }

  // activates/deactivates event lstener and sends selected answer to model to check if it is correct.
  selectedAnswer(handler) {
    const questionContainer = document.querySelector(".question-container");

    // event listener click handler
    function handleClick(event) {
      const selected = event.target.closest(".answer"); // get selected element
      if (!selected) return; // guard clause
      const selectedContent = selected.textContent; // the the text content of selected element

      // if answer selected - perform chech for correctness, remove listener and mark as selected.
      if (selectedContent) {
        selected.classList.add("selected");
        questionContainer.removeEventListener("click", handleClick);
        const isCorrect = handler(selectedContent);

        // if the answer is correct
        if (isCorrect) {
          selected.classList.add("right");
        }

        // if the answer is incorrect
        if (!isCorrect) {
          selected.classList.add("wrong");
        }
      }
    }

    questionContainer.addEventListener("click", handleClick); // activate wnswer elements with even propagetion.
  }

  // continue to next question.
  nextQuestion(handler) {
    const nextBtn = document.querySelector(".next-btn");
    nextBtn.addEventListener("click", handler); // launches the 'renderQuestion' fn from the controller
  }

  // countdown timer function.
  countdown(handler) {
    const statusTimer = document.querySelector(".status-timer");

    // total time calculated by defqult time for each question.
    let totalSecs = QUES_TIME * NUM_QUES;

    const intervalId = setInterval(() => {
      if (totalSecs > 0) {
        const minutes = Math.floor(totalSecs / 60);
        const seconds = totalSecs % 60;

        // converting mins & secs to time string forman.
        const formattedTime = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;

        statusTimer.textContent = formattedTime;
        totalSecs--;
      } else {
        clearInterval(intervalId); // killing the timer.
        handler();
      }
    }, 1000);
  }

  // Render Score Board page.
  renderEndgameDom(nickname, score, answered) {
    this.clearDom();
    const markup = this.#generateEndMarkup(nickname, score, answered);
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // Render all scores on scoreBoard.
  renderLogs(boardObj) {
    const boardInfo = document.querySelector(".board");

    // renders logs on scoreboard for each scoreBoard object.
    boardObj.forEach((obj, i) => {
      const tag = obj.tag ? obj.tag : "";

      boardInfo.insertAdjacentHTML(
        "beforeend",
        this.#generateLogMarkup(obj, i, tag)
      );
    });
  }

  // activating end game buttons.
  activateEndBtns(backHandler, playAgainHandler) {
    const backToMenu = document.querySelector(".back-menu");
    const playAgain = document.querySelector(".play-again");

    backToMenu.addEventListener("click", backHandler);
    playAgain.addEventListener("click", playAgainHandler);
  }

  // generate log html for scoreboard.
  #generateLogMarkup(obj, index, tag) {
    const place = index + 1;

    return `
    <div class="log ${tag}">
    <div class="place">${`${place}`.padStart(2, "0")}</div>
    <div class="nick">${obj.nickname}</div>
    <div class="points">${obj.score}</div>
  </div>
    `;
  }

  // generate html elements for scores screen.
  #generateEndMarkup(nickname, score, answered) {
    return `
<section class="end-section">
        <div class="endgame-score">
          <div class="end-nickname"><b>Nickname: ${nickname}</b></div>
          <div class="answered"><b>Correct Answers: ${answered}</b></div>
          <div class="score"><b>Score: ${score}</b></div>
          <div class="time-left"><b>Time Left: 01:22</b></div>
        </div>

        <div class="scoreboard">
          <div class="board">
            <div class="board-info">
              <div class="place-info"><b>Place</b></div>
              <div class="nick-info"><b>Nickname</b></div>
              <div class="points-info"><b>Score</b></div>
            </div>
          </div>
        </div>
        
        <div class="end-btns">
          <button class="back-menu btn">Main Page</button>
          <button class="play-again btn">Play Again</button>
        </div>
      </section>
`;
  }

  // generates first page HTML markup.
  #generateStarMarkup() {
    return `
    <section class="start-section">
    <img class="logo-img" src="./imgs/trivme.png" alt="app logo" />

        <div class="difficulty-select">
          <span><b>Select Difficulty:</b></span>
          <select class='select-dificulty' name="difficulty" id="01">
            <option value="any">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <p>
            <b>The selected difficulty will effect your score points. </b><br />
            Selecting 'Easy' will give you <b>10</b> points for correct
            answer.<br />
            Selecting 'Medium' will give you <b>12</b> points. <br />
            Selecting 'Hard' will give you <b>15</b> pionts.<br />
            Selecting 'Any' will award you with <b>13</b> points for each
            correct answer
          </p>
        </div>

        <div class="category-select">
          <span><b>Select Category:</b></span>
          <select class="category" name="category" id="02">
            <option value="any">Any Category</option>
            <option value="9">General Knowledge</option>
            <option value="10">Entertainment: Books</option>
            <option value="11">Entertainment: Film</option>
            <option value="12">Entertainment: Music</option>
            <option value="13">Entertainment: Musicals & Theatres</option>
            <option value="14">Entertainment: Television</option>
            <option value="15">Entertainment: Video Games</option>
            <option value="16">Entertainment: Board Games</option>
            <option value="17">Science & Nature</option>
            <option value="18">Science: Computers</option>
            <option value="19">Science: Mathematics</option>
            <option value="20">Mythology</option>
            <option value="21">Sports</option>
            <option value="22">Geography</option>
            <option value="23">History</option>
            <option value="24">Politics</option>
            <option value="25">Art</option>
            <option value="26">Celebrities</option>
            <option value="27">Animals</option>
            <option value="28">Vehicles</option>
            <option value="29">Entertainment: Comics</option>
            <option value="30">Science: Gadgets</option>
            <option value="31">Entertainment: Japanese Anime & Manga</option>
            <option value="32">Entertainment: Cartoon & Animations</option>
          </select>
          <p>
            Selecting 'Any Category' will award you with 1 extra point for each
            correct answer.
          </p>
        </div>

        <div class="nickname">
          <span><b>Nickname:</b></span>
          <input class="input-nickname" type="text" />
          <p>
            The nickname should contain 15 characters at most. 
          </p>
        </div>

        <div class="start-game">
          <button class="start-btn">Start Game</button>
        </div>
        <section>
    `;
  }
}

export default new AppView();
