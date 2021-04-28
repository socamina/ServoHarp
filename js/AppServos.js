const { ipcRenderer } = require("electron");

class AppServos {
  constructor() {
    console.log("LOG depuis la page HTML");
    this.initListeners();
  }

  initListeners() {
    ipcRenderer.on("messageDiscord", this.onMessage.bind(this));
  }

  onMessage(event, message) {
  console.log(message);
 var screenMessage = document.getElementById("screenMessage");
console.log(screenMessage);
screenMessage.innerHTML = message;
  }
}

window.onload = () => {
  new AppServos();
};
