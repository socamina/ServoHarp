const { Client, MessageEmbed } = require("discord.js");
const { Board, Servo } = require("johnny-five");

class DiscordBotServos {
  constructor(token, win) {
    console.log("Bot start");

    this.win = win;
    this.client = new Client();
    this.client.on("ready", this.onReady.bind(this));
    this.client.on("message", this.onMessage.bind(this));
    this.client.login(token);
    this.users = [];
    this.usersIndex = {};
    // this.servo1;
    // this.servo2;
    // this.servo3;
    // this.servo4;
    this.initArduino();
  }

  initArduino() {
    this.board = new Board({ repl: false });
    this.board.on("ready", this.onBoardReady.bind(this));
    console.log("BOARD STARTED");
  }

  onBoardReady() {
    console.log("Board ready");

    this.servo1 = new Servo(12);
    this.servo2 = new Servo(11);
    this.servo3 = new Servo(10);
    this.servo4 = new Servo(9);
    this.servo5 = new Servo(12);
    this.servo6 = new Servo(7);
    this.servo7 = new Servo(6);
    this.servo8 = new Servo(5);
    this.servo9 = new Servo(4);
    this.servo10 = new Servo(3);
    this.servo11 = new Servo(2);
    this.servo12 = new Servo(1);

    this.angle1 = 0;
    this.angle2 = 0;
    this.angle3 = 0;
    this.angle4 = 0;
    this.angle5 = 0;
    this.angle6 = 0;
    this.angle7 = 0;
    this.angle8 = 0;

    this.servo1.center();
    this.servo2.center();
    this.servo3.center();
    this.servo4.center();
    this.servo5.center();
    this.servo6.center();
    this.servo7.center();
    this.servo8.center();
    this.servo9.center();
    this.servo10.center();
    this.servo11.center();
    this.servo12.center();
    // delay(100);
  }

  onReady() {
    console.log("BOT READY");
    this.list = this.client.guilds.cache.get("836975500043616294");
    //console.log(this.list);
    this.list.members.cache.forEach((member) =>
      this.users.push(member.user.username)
    );
    console.log(this.users);
    this.users.pop();
    console.log(this.users);
  }

  onMessage(message) {
    var messageInfo = {
      content: message.content,
      author: message.author.username,
    };
    this.win.webContents.send("messageDiscord", messageInfo);

    // ARPEGE PARTS

    // if(message.author.username == this.users[0]){
    //   console.log("user0 sent a message");
    // }
    // else if(message.author.username == this.users[1]){
    //   console.log("user1 sent a message");
    // }
    //console.log(messageInfo);

    //USER 0
    if (message.author.username == this.users[0] && this.angle1 == 0) {
      this.angle1 += 30;
      this.servo1.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo3.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo5.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo8.to(that.angle1);
      }, 6000);
    } else if (message.author.username == this.users[0] && this.angle1 == 30) {
      this.angle1 -= 30;
      this.servo1.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo3.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo5.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo8.to(that.angle1);
      }, 6000);
    }

    // USER 1
    if (message.author.username == this.users[1] && this.angle1 == 0) {
      this.angle1 += 30;
      this.servo2.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo4.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo6.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo9.to(that.angle1);
      }, 6000);
    } else if (message.author.username == this.users[1] && this.angle1 == 30) {
      this.angle1 -= 30;
      this.servo2.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo4.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo6.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo9.to(that.angle1);
      }, 6000);
    }

    // USER 2
    if (message.author.username == this.users[2] && this.angle1 == 0) {
      this.angle1 += 30;
      this.servo3.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo5.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo7.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo10.to(that.angle1);
      }, 6000);
    } else if (message.author.username == this.users[2] && this.angle1 == 30) {
      this.angle1 -= 30;
      this.servo3.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo5.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo7.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo10.to(that.angle1);
      }, 6000);
    }

    // USER 3
    if (message.author.username == this.users[2] && this.angle1 == 0) {
      this.angle1 += 30;
      this.servo4.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo6.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo8.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo11.to(that.angle1);
      }, 6000);
    } else if (message.author.username == this.users[2] && this.angle1 == 30) {
      this.angle1 -= 30;
      this.servo4.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo6.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo8.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo11.to(that.angle1);
      }, 6000);
    }

    // USER 4
    if (message.author.username == this.users[2] && this.angle1 == 0) {
      this.angle1 += 30;
      this.servo5.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo7.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo9.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo12.to(that.angle1);
      }, 6000);
    } else if (message.author.username == this.users[2] && this.angle1 == 30) {
      this.angle1 -= 30;
      this.servo5.to(this.angle1);

      var that = this;
      setTimeout(function () {
        that.servo7.to(that.angle1);
      }, 2000);

      setTimeout(function () {
        that.servo9.to(that.angle1);
      }, 4000);

      setTimeout(function () {
        that.servo12.to(that.angle1);
      }, 6000);
    }



    // EMOJI PARTS

    if (this.angle1 == 0 && message.content == "1") {
      this.angle1 += 30;
      this.servo1.to(this.angle1);
      console.log(this.angle1);
    } else if (this.angle1 == 30 && message.content == "1") {
      this.angle1 -= 30;
      this.servo1.to(this.angle1);
      console.log(this.angle1);
    }

    if (this.angle2 == 0 && message.content == "2") {
      //console.log(this.servo);
      this.angle2 += 30;
      this.servo2.to(this.angle2);
      console.log(this.angle2);
    } else if (this.angle2 == 30 && message.content == "2") {
      this.angle2 -= 30;
      this.servo2.to(this.angle2);
      console.log(this.angle2);
    }

    if (this.angle3 == 0 && message.content == "3") {
      //console.log(this.servo);
      this.angle3 += 30;
      this.servo3.to(this.angle3);
      console.log(this.angle3);
    } else if (this.angle3 >= 30 && message.content == "3") {
      this.angle3 -= 30;
      this.servo3.to(this.angle3);
      console.log(this.angle3);
    }

    if (this.angle4 == 0 && message.content == "4") {
      //console.log(this.servo);
      this.angle4 += 30;
      this.servo4.to(this.angle4);
      console.log(this.angle4);
    } else if (this.angle4 == 30 && message.content == "4") {
      this.angle4 -= 30;
      this.servo4.to(this.angle4);
      console.log(this.angle4);
    }

    if (this.angle5 == 0 && message.content == "5") {
      //console.log(this.servo);
      this.angle5 += 20;
      this.servo5.to(this.angle5);
      console.log(this.angle5);
    } else if (this.angle5 == 30 && message.content == "5") {
      this.angle5 -= 30;
      this.servo5.to(this.angle5);
      console.log(this.angle5);
    }

    if (this.angle6 == 0 && message.content == "6") {
      this.angle6 += 20;
      this.servo6.to(this.angle6);
      console.log(this.angle6);
    } else if (this.angle6 == 30 && message.content == "6") {
      this.angle6 -= 30;
      this.servo6.to(this.angle6);
      console.log(this.angle6);
    }

    if (this.angle7 == 0 && message.content == "7") {
      //console.log(this.servo);
      this.angle7 += 20;
      this.servo7.to(this.angle7);
      console.log(this.angle7);
    } else if (this.angle7 == 30 && message.content == "7") {
      this.angle7 -= 30;
      this.servo7.to(this.angle7);
      console.log(this.angle7);
    }

    if (this.angle8 == 0 && message.content == "8") {
      //console.log(this.servo);
      this.angle8 += 20;
      this.servo8.to(this.angle8);
      console.log(this.angle8);
    } else if (this.angle8 == 30 && message.content == "8") {
      this.angle8 -= 30;
      this.servo8.to(this.angle8);
      console.log(this.angle8);
    }

    if (this.angle9 == 0 && message.content == "9") {
      //console.log(this.servo);
      this.angle9 += 20;
      this.servo9.to(this.angle9);
      console.log(this.angle9);
    } else if (this.angle9 == 30 && message.content == "9") {
      this.angle9 -= 30;
      this.servo9.to(this.angle9);
      console.log(this.angle9);
    }

    if (this.angle10 == 0 && message.content == "10") {
      //console.log(this.servo);
      this.angle10 += 20;
      this.servo10.to(this.angle10);
      console.log(this.angle10);
    } else if (this.angle10 == 30 && message.content == "10") {
      this.angle10 -= 30;
      this.servo10.to(this.angle10);
      console.log(this.angle10);
    }

    if (this.angle11 == 0 && message.content == "11") {
      //console.log(this.servo);
      this.angle11 += 20;
      this.servo11.to(this.angle11);
      console.log(this.angle11);
    } else if (this.angle11 == 30 && message.content == "11") {
      this.angle11 -= 30;
      this.servo11.to(this.angle11);
      console.log(this.angle11);
    }

    if (this.angle12 == 0 && message.content == "12") {
      //console.log(this.servo);
      this.angle12 += 20;
      this.servo12.to(this.angle12);
      console.log(this.angle12);
    } else if (this.angle12 == 30 && message.content == "12") {
      this.angle12 -= 30;
      this.servo12.to(this.angle12);
      console.log(this.angle12);
    }

    //BUTTON RESPONSE
    if (message.content == "click") {
      const answer = "pong";
      message.channel.send(answer);
    }
  }
  ontest() {
    this.servo2.to(this.angle1);
    console.log(this.servo2);
  }
}

module.exports = { DiscordBotServos };
