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

    // this.button = new Button(14);

    this.button = new Button({
      pin: 14,
      isPullup: true
    });

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

  async arpeggio(accord, { duration = 600 } = {}) {
    for (let servoIndex of accord) {
      this.swipeToOppositeSide(servoIndex);
      await delay(duration);
    }
  }

  //swipeToOppositeSide(servoIndex, min = 0, max = 180) {
     swipeToOppositeSide(servoIndex, min =65, max = 104) {
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
        await this.arpeggio([11,9,7,4]);
        break;
      case this.users[1]:
        //await this.arpeggio([10, 8, 6, 3]);
        break;
      case this.users[2]:
        await this.arpeggio([9,7,5,2]);
        break;
      case this.users[3]:
        await this.arpeggio([8,6,4,1]);
        break;
      case this.users[4]:
        await this.arpeggio([7, 5, 3, 0]);
        break;
    }

    // EMOJI BIT

    if (message.content === "all") {
      this.arpeggio([0,1,2,3, 4,5,6, 7,8,9,10,11]);
      return;
    }


    if (message.content === "user0") {
      this.arpeggio([11,9,7,4]);
      return;
    }

    if (message.content === "user1") {
      this.arpeggio([10, 8, 6, 3]);
      return;
    }

    if (message.content === "user2") {
      this.arpeggio([9,7,5,2]);
      return;
    }

    if (message.content === "user3") {
      this.arpeggio([8,6,4,1]);
      return;
    }

    if (message.content === "user4") {
      this.arpeggio([7, 5, 3, 0]);
      return;
    }

    // if (message.content === "melodie") {
    //   this.arpeggio([6,6,5,4,4,5,6,7,8,8,7,6,6,7,7 ]);
    //   return;
    // }

      if (message.content === "melodie") {
       this.arpeggio([6,6,5,4,4,5,6,7,8,8,7,6,6,7,7, 6,6,5,4,4,5,6,7,8,8,7,6,7,8,8 ]);
    //   //si si do re re do si la sol sol la si la la, si si do re re do si la sol sol la si la sol sol
    //   // la la si sol la si do si sol, la si do si la sol la re
      return;
     }

    if (message.content === "test0") {
      this.arpeggio([0,0,0,0]);
      return;
    }

    if (message.content === "test1") {
      this.arpeggio([1, 1, 1, 1]);
      return;
    }
    if (message.content === "test2") {
      this.arpeggio([2, 2, 2,2]);
      return;
    }
    if (message.content === "test3") {
      this.arpeggio([3, 3, 3, 3]);
      return;
    }

    if (message.content === "test4") {
      this.arpeggio([4,4,4,4]);
      return;
    }

    if (message.content === "test5") {
      this.arpeggio([5, 5, 5, 5]);
      return;
    }
    
    if (message.content === "test6") {
      this.arpeggio([6,6,6,6]);
      return;
    }
    if (message.content === "test7") {
      this.arpeggio([7,7,7,7]);
      return;
    }

    if (message.content === "test8") {
      this.arpeggio([8, 8, 8,8]);
      return;
    }

    if (message.content === "test9") {
      this.arpeggio([9,9,9,9]);
      return;
    }

    if (message.content === "test10") {
      this.arpeggio([10, 10, 10, 10]);
      return;
    }

    if (message.content === "test11") {
      this.arpeggio([11, 11, 11, 11]);
      return;
    }

    if (message.content === "reset") {
       this.servos.each((servoIndex, index) => this.toAngle(servoIndex, 90));
      // for(let i=0;i<this.servos.length;i++){
      //   this.servos[i].to(90);
      //   this.enabled = true;
      // }
      return;
    }

    if (message.content === "min") {
         this.servos.each((servoIndex, index) => this.toAngle(servoIndex, 0));
        // for(let i=0;i<this.servos.length;i++){
        //   this.servos[i].min();
        //   this.enabled = true;
        // }
      return;
    }

    if (message.content === "max") {
       this.servos.each((servoIndex, index) => this.toAngle(servoIndex, 180));
      // for(let i=0;i<this.servos.length;i++){
      //   this.servos[i].max();
      //   this.enabled = true;
      // }
      return;
    }

    const chars = message.content.split(""); // split into characters (letters, emoji, punctuation)

    for (let char of chars) {
      await this.playChar(char);
    }
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
