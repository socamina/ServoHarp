const { Client, MessageEmbed } = require("discord.js");
const { Board, Servo, Button, Servos } = require("johnny-five");

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
    this.board;
    this.enabled = false;
    this.button;
    this.replies = ["Je suis indisponible pour le moment, je répond après.","J'arrive","Attendez, je vous répond plus tard","J'ai pas le temps de vous lire maintenant","Je suis occupée"];
    this.initArduino();
  }

  initArduino() {
    this.board = new Board({ repl: true });
    this.board.on("ready", this.onBoardReady.bind(this));
    console.log("BOARD STARTED");
  }

  pushButton() {
    console.log("button pushed");
  }

  async onBoardReady() {
    console.log("Board ready");

    const channel = this.client.channels.cache.get("836975500525174804");

    this.button = new Button(14);

    this.servos = new Servos([
      { pin: 2, invert: true },
      { pin: 3 },
      { pin: 4, invert: true },
      { pin: 5 },
      { pin: 6, invert: true },
      { pin: 7 },
      { pin: 8, invert: true },
      { pin: 9 },
      { pin: 10, invert: true },
      { pin: 11 },
      { pin: 12, invert: true },
      { pin: 13 },
    ]);

    this.angles = [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90];

    this.button.on("down", () => {
      if (this.enabled) {
        var randomReply = this.replies[Math.floor(Math.random()*this.replies.length)];
        channel.send(randomReply);
      } else {
        console.log("button enabled");
        this.enabled = true;
      }
    });

    this.board.repl.inject({
      button: this.button,
      servos: this.servos,
    });

    this.servos.each((servo, index) => {
      this.resyncServo(index);
    });

    await delay(4000);
    console.log("waiting over you can gooo");
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

  async arpeggio(accord, { duration = 800 } = {}) {
    for (let servoIndex of accord) {
      this.swipeToOppositeSide(servoIndex);
      await delay(duration);
    }
  }

  swipeToOppositeSide(servoIndex, min = 0, max = 180) {
    const currAngle = this.getAngle(servoIndex);
    const angle = currAngle > 90 ? min : max;
    this.toAngle(servoIndex, angle);
  }

  getAngle(servoIndex) {
    return this.angles[servoIndex];
  }

  resyncServo(servoIndex) {
    // force servo to last saved angle
    this.toAngle(servoIndex, this.getAngle(servoIndex));
  }

  toAngle(servoIndex, angle) {
    this.angles[servoIndex] = angle;
    this.servos[servoIndex].to(angle);
  }

  async onMessage(message) {
    var messageInfo = {
      content: message.content,
      author: message.author.username,
    };

    this.win.webContents.send("messageDiscord", messageInfo);

    // ARPEGGIO BIT

    switch (messageInfo.author) {
      case this.users[0]:
        await this.arpeggio([0, 2, 4, 7]);
        break;
      case this.users[1]:
        await this.arpeggio([1, 3, 5, 8]);
        break;
      case this.users[2]:
        await this.arpeggio([2, 4, 6, 9]);
        break;
      case this.users[3]:
        await this.arpeggio([3, 5, 7, 10]);
        break;
      case this.users[4]:
        await this.arpeggio([4, 6, 8, 11]);
        break;
    }

    // EMOJI BIT

    if (message.content === "test11") {
      this.arpeggio([11, 11, 11, 11]);
      return;
    }

    if (message.content === "reset") {
      this.servos.each((servo, index) => this.toAngle(servoIndex, 90));
      return;
    }

    if (message.content === "min") {
        this.servos.each((servo, index) => this.toAngle(servoIndex, 0));
      return;
    }

    if (message.content === "max") {
      this.servos.each((servo, index) => this.toAngle(servoIndex, 180));
      return;
    }

    const chars = message.content.split(""); // split into characters (letters, emoji, punctuation)

    for (let char of chars) {
      await this.playChar(char);
    }

    //BUTTON RESPONSE

    // button.on("down", function() {
    //   console.log("down");
    // });

    // if (message.content == "help") {
    //   const answer = "je ne suis pas disponible pour le moment";
    //   message.channel.send(answer);
    // }
  }

  async playChar(char) {
    const table = {
      "😀": 0,
      1: 1,
      2: 2,
      3: 3,
      4:4,
      5:5,
      6:6,
      7:7,
      8:8,
      9:9,
      "dix":10,
      "onze":11,
    };

    if (!(char in table)) return;

    const servoIndex = table[char];
    this.swipeToOppositeSide(servoIndex);
    await delay(1000);
  }
}

async function delay(millis = 0) {
  return new Promise(function (resolve) {
    setTimeout(resolve, millis);
  });
}

module.exports = { DiscordBotServos };
