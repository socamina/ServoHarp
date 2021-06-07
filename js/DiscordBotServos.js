const { Client, MessageEmbed } = require("discord.js");
const { split } = require("emoji-aware");
const { Board, Servo, Button, Servos } = require("johnny-five");

const MIN = 65;
const MAX = 104;

let KILL = false;

const { RE1, MI1, FA1, SOL1, LA1, SI1, DO2, RE2, MI2, FA2, SOL2, LA2 } = {
  RE1: 11,
  MI1: 10,
  FA1: 9,
  SOL1: 8,
  LA1: 7,
  SI1: 6,
  DO2: 5,
  RE2: 4,
  MI2: 3,
  FA2: 2,
  SOL2: 1,
  LA2: 0,
};

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
    this.replies = [
      "Je suis indisponible pour le moment, je répond après.",
      "J'arrive",
      "Attendez, je vous répond plus tard",
      "J'ai pas le temps de vous lire maintenant",
      "Je suis occupée",
    ];
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
      isPullup: true,
    });

    this.servos = new Servos([
      { pin: 2, invert: true, range: [MIN, MAX] }, //
      { pin: 3, range: [MIN, MAX] },
      { pin: 4, invert: true, range: [MIN, MAX] },
      { pin: 5, range: [MIN, MAX] },
      { pin: 6, invert: true, range: [MIN, MAX] },
      { pin: 7, range: [MIN, MAX] },
      { pin: 8, invert: true, range: [MIN, MAX] },
      { pin: 9, range: [MIN, MAX ] },
      { pin: 10, invert: true, range: [MIN, MAX] },
      { pin: 11, range: [MIN, MAX] },
      { pin: 12, invert: true, range: [MIN, MAX] },
      { pin: 13, range: [MIN, MAX] },
    ]);


    this.angles = [MIN, MIN, MIN, MIN, MIN, MIN, MIN, MIN, MIN, MIN, MIN, MIN];
    // this.angles = [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90];

    this.button.on("down", () => {
      if (this.enabled) {
        var randomReply =
          this.replies[Math.floor(Math.random() * this.replies.length)];
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
    KILL = false;

    for (let servoIndex of accord) {
      this.swipeToOppositeSide(servoIndex);
      // if (KILL) break;
      await delay(duration);
      // if (KILL) break;
    }
  }

  async testServo(servoIndex) {
    const nRepeat = 4;
    const arp = Array(nRepeat).fill(servoIndex);

    await this.arpeggio(arp);
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

  async arpeggioDelay(accordAndDelays, { duration = 0 } = {}) {
    KILL = false;

    for (let value of accordAndDelays) {
      if (value > 20) {
        await delay(value);
      } else {
        this.swipeToOppositeSide(value);
        await delay(duration);
      }
    }
  }

  async onMessage(message) {
    var messageInfo = {
      content: message.content,
      author: message.author.username,
    };

    this.win.webContents.send("messageDiscord", messageInfo);

    // if (message.content === "kill") {
    //   KILL = true;
    //   this.servos.each((servo, index) => this.toAngle(index, 90));
    //   return;
    // }

    // ARPEGGIO BIT

    switch (messageInfo.author) {
      case this.users[0]:
        // await this.arpeggio([11, 9, 7, 4]);
        await this.arpeggioDelay([11, 1000, 9, 800, 7, 600, 4,2500]);
        break;
      case this.users[1]:
        await this.arpeggioDelay([MI1, 1000, SOL1, 800, SI1, 600, MI2, 2500]);
        break;
      case this.users[2]:
        // await this.arpeggio([9, 7, 5, 2]);
        await this.arpeggioDelay([9,1000, 7,800, 5,600, 2,2500]);
        break;
      case this.users[3]:
        await this.arpeggio([8,1000, 6, 800, 4, 600, 1,2500]);
        break;
      case this.users[4]:
        await this.arpeggio([7,1000, 5,800, 3,600, 0,2500]);
        break;
    }

    // EMOJI BIT

    if (message.content === "all")
      return this.arpeggio([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    if (message.content === "user0") return this.arpeggio([11, 9, 7, 4]);

    if (message.content === "user1") return this.arpeggio([10, 8, 6, 3]);

    if (message.content === "user2") return this.arpeggio([9, 7, 5, 2]);

    if (message.content === "user3") return this.arpeggio([8, 6, 4, 1]);

    if (message.content === "user4") return this.arpeggio([7, 5, 3, 0]);

    if (message.content === "🎉") {
      //prettier-ignore
      await this.arpeggio([SI1, SI1, DO2, RE2, RE2, DO2, SI1, LA1, SOL1, SOL1, LA1, SI1, SI1, LA1, LA1]);
      await delay(1000);
      //prettier-ignore
      await this.arpeggio([SI1, SI1, DO2, RE2, RE2, DO2, SI1, LA1, SOL1, SOL1, LA1, SI1, LA1, SOL1, SOL1]);
      return;
    }

    const testMap = {
      test0: 0,
      test1: 1,
      test2: 2,
      test3: 3,
      test4: 4,
      test5: 5,
      test6: 6,
      test7: 7,
      test8: 8,
      test9: 9,
      test10: 10,
      test11: 11,
    };

    if (message.content in testMap)
      return this.testServo(testMap[message.content]);

    if (message.content === "reset")
      return this.servos.each((servo, index) => this.toAngle(index, 90));

    if (message.content === "min")
      return this.servos.each((servo, index) => this.toAngle(index, 0));

    if (message.content === "max")
      return this.servos.each((servo, index) => this.toAngle(index, 180));

    const chars = split(message.content); // split into characters (letters, emoji, punctuation)

    for (let char of chars) {
      await this.playChar(char);
    }
  }

  async playChar(char) {
    const table = {
      "😂": 0,
      "😭": 1,
      "🥺": 2,
      "🤣": 3,
      "👏": 4,
      "👍": 5,
      "❤️": 6,
      "✨": 7,
      "😍": 8,
      "😊": 9,
      "❓": 10,
      "❗️": 11,
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
