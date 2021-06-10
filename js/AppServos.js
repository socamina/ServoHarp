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

    var msgLength = message.content.length * 3;
    if(msgLength > 20){
      msgLength = message.content.length/2;
    }
    console.log(message);
    var msgDiscord = document.getElementById("msgDiscord");
    var divWidth = document.getElementById("msgContainer").offsetWidth;
    console.log(divWidth/msgLength);

    msgDiscord.style.fontSize = divWidth/msgLength + "px";
    msgDiscord.innerHTML = message.content;

    if(message.content == "tonemoji"){
      document.body.classList.add("isBot");
      setTimeout(function(){document.body.classList.remove("isBot")}, 2000);
      document.body.innerHTML = message.content;
    } 
    if(message.content == "reset"){
      document.body.classList.add("isBot");
      setTimeout(function(){document.body.classList.remove("isBot")}, 2000);
      document.body.innerHTML = message.content;
    }
  }
}

window.onload = () => {
  new AppServos();
};
