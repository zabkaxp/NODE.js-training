const parseArgs = require("minimist");
const fs = require("fs");

const command = parseArgs(process.argv.slice(2, 3));
delete command._;

const handleCommand = ({ add, remove, list }) => {
  if (add) {
    if (typeof add !== "string") {
      return console.log("dodawane zadanie musi byc w formie tekstu");
    } else if (add.length < 6) {
      console.log("nazwa musi miec wiecej niz 6 znakow");
      process.exit();
    }
    handleData(1, add); // 1 just for readibility setting it as one, add- content of add
  } else if (remove) {
    if (typeof remove !== "string" || remove.length < 6) {
      return console.log("wpisz poprawna nazwe usuwanego zadania");
    }
    handleData(2, remove);
  } else if (list || list === "") {
    // jezeli ktos wpisze list="" to zwroci undefined
    handleData(3, null);
  } else {
    return console.log("nie rozumiem polecenia");
  }
};

const handleData = (type, title) => {
  //type- number: 1-add, 2-remove, 3-list
  const data = fs.readFileSync("data.json");
  let tasks = JSON.parse(data); //przeksztalca JSON na JS

  if (type === 1 || type === 2) {
    const exists = tasks.find(task => task.title === title) ? true : false;

    if (type === 1 && exists) {
      return console.log("takie zadanie juz istnieje");
    } else if (type === 2 && !exists) {
      return console.log("nie moge usunac zadania ktore nie istnieje");
    }
  }
  let dataJSON;
  switch (type) {
    case 1:
      tasks = tasks.map((task, index) => ({
        id: index + 1,
        title: task.title
      }));
      const id = tasks.length + 1;
      tasks.push({ id: id, title: title }); //mozna tez to zapisac {id, title}

      dataJSON = JSON.stringify(tasks); //zamieniamy obiekt na JSONa
      fs.writeFileSync("data.json", dataJSON);
      console.log(`zadanie ${title} zostalo dodane`);
      break;
    case 2:
      const index = tasks.findIndex(task => (task.title = title));
      tasks.splice(index, 1);
      tasks = tasks.map((task, index) => ({
        id: index + 1,
        title: task.title
      }));

      dataJSON = JSON.stringify(tasks);
      fs.writeFile("data.json", dataJSON, "utf8", err => {
        if (err) throw err;
        console.log(`zadanie ${title} zostalo usuniete`);
      });
      break;
    case 3:
      if (tasks.length) {
        console.log(
          `Lista zadan do zrobienia obejmuje ${
            tasks.length
          } zadania. \nOto one:`
        );
        tasks.forEach(task => {
          console.log(task.title);
        });
      }
      break;
  }
};

handleCommand(command);
