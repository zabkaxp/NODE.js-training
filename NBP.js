const request = require("request");
const fs = require("fs");
//http://api.nbp.pl/api/exchangerates/rates/a/chf/?format=json

const validCodes = ["usd", "eur", "gbp", "chf"];

const code = process.argv[2];

const url = `http://api.nbp.pl/api/exchangerates/rates/a/${code}/?format=json`;

const isValid = validCodes.find(currency => currency === code)
  ? true
  : process.exit();

request(url, { json: true }, (err, res, body) => {
  if (err) {
    return console.log("blad: ", err);
  }
  const message = `srednia cena ${body.currency} w dniu ${
    body.rates[0].effectiveDate
  } wynosi ${body.rates[0].mid} zlotych`;

  fs.appendFile("currencies.txt", message + "\n", err => {
    console.log("wynik dodany do pliku");
  });
  console.log(message);
});
