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

      document.body.classList.add("isBot");
      setTimeout(function(){document.body.classList.remove("isBot")}, 2000);
  
      // document.body.classList.remove("isBot2");
   
    document.body.innerHTML = message;

//   console.log(message);
//  var screenMessage = document.getElementById("screenMessage");
// console.log(screenMessage);
// screenMessage.innerHTML = message;
  }
}

window.onload = () => {
  new AppServos();
};
