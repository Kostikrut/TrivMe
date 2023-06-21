// fn fetches the data from api
export const getJson = async function (url) {
  try {
    const questions = await fetch(url);

    if (!questions.ok)
      throw new Error(`Something went wrong. ${questions.status}`);

    const data = await questions.json();
    const { results } = data;

    return results;
  } catch (err) {
    throw new Error(err);
  }
};

// test onjexts for score board.
export const testBoard = [
  {
    nickname: "Jake",
    score: 77,
    tag: "",
  },
  {
    nickname: "Marry",
    score: 27,
    tag: "",
  },
  {
    nickname: "Steven",
    score: 0,
    tag: "",
  },
  {
    nickname: "Orlando",
    score: 30,
    tag: "",
  },
  {
    nickname: "Kane",
    score: 3,
    tag: "",
  },
  {
    nickname: "Bob",
    score: 22,
    tag: "",
  },
  {
    nickname: "Inna",
    score: 10,
    tag: "",
  },
  {
    nickname: "Clara",
    score: 55,
    tag: "",
  },
  {
    nickname: "Uri",
    score: 26,
    tag: "",
  },
  {
    nickname: "Ben",
    score: 16,
    tag: "",
  },
  {
    nickname: "Orli",
    score: 12,
    tag: "",
  },
  {
    nickname: "Jin",
    score: 10,
    tag: "",
  },
];
