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

    if(message.content == "tonemoji"){
      document.body.classList.add("isBot");
      setTimeout(function(){document.body.classList.remove("isBot")}, 2000);
      document.body.innerHTML = message.content;
    } 
    if(message.content == "pong"){
      document.body.classList.add("isBot");
      setTimeout(function(){document.body.classList.remove("isBot")}, 2000);
      document.body.innerHTML = message.content;
    }
  }
}

window.onload = () => {
  new AppServos();
};
