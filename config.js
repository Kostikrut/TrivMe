export let NUM_QUES = 10; // number of total questions.
export let QUES_TIME = 15; // seconds for one question.
export let FETCH_URL = ""; // url for fetching.

// builds the url based on selected chices
export let constructUrl = function (cat, dif) {
  let difficulty = "";
  let category = "";

  difficulty = dif !== "any" ? `&difficulty=${dif}` : "";
  category = cat !== "any" ? `&category=${cat}` : "";

  FETCH_URL = `https://opentdb.com/api.php?amount=${NUM_QUES}${category}${difficulty}&type=multiple`;
};
