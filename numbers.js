const fetch = require("node-fetch");
const arg = process.argv[2];
//http://numbersapi.com/random/math?json`)

let type = "";

if (arg.indexOf("--year") === 0) {
  console.log("szukamy informacji o roku ...");
  type = "year";
} else if (arg.indexOf("--math") === 0) {
  console.log("szukamy informacji o liczbie...");
  type = "math";
} else if (arg.indexOf("--trivia") === 0) {
  console.log("szukamy liczby-ciekawostki ...");
  type = "trivia";
}

const equalSign = arg.search("=");
if (equalSign === -1) console.log("nie wpsiałeś liczby!");

const number = arg.slice(equalSign + 1);

if (number === "" || isNaN(Number(number))) {
  console.log("to nie jest liczba!");
}

fetch(`http://numbersapi.com/${number}/${type}?json`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("oooo coś nie tak: " + response.status);
    }
  })
  .then(response => console.log(response.text))
  .catch(err => console.log("Błąd: ", err));
