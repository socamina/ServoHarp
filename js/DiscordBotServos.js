let timeoutCache;
let KILL = false;

const { Client, MessageEmbed } = require("discord.js");
const { split } = require("emoji-aware");
const { Board, Servo, Button, Servos } = require("johnny-five");

const MIN = 65;
const MAX = 104;

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
      /* 0 */ { pin: 2, invert: true, range: [MIN, MAX] },
      /* 1 */ { pin: 3, range: [60, 95] },
      /* 2 */ { pin: 4, invert: true, range: [MIN, MAX] },
      /* 3 */ { pin: 5, range: [65, 90] },
      /* 4 */ { pin: 6, invert: true, range: [MIN, MAX] },
      /* 5 */ { pin: 7, range: [65, 90] },
      /* 6 */ { pin: 8, invert: true, range: [MIN, MAX] },
      /* 7 */ { pin: 9, range: [65, 90] },
      /* 8 */ { pin: 10, invert: true, range: [MIN, MAX] },
      /* 9 */ { pin: 11, range: [65, 90] },
      /* 10 */ { pin: 12, invert: true, range: [MIN, MAX] },
      /* 11 */ { pin: 13, range: [65, 90] },
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
  async testAngle(servoIndex, angle = 90) {
    this.servos[servoIndex].to(angle);
  }

  swipeToOppositeSide(servoIndex, min = 0, max = 180) {
    const currAngle = this.getAngle(servoIndex);

    //console.log(this.servos[servoIndex]);

    // [min, max] = this.servos[servoIndex].range;
    //console.log(this.servos[servoIndex].range);
    // const angle = currAngle > 90 ? MIN : MAX;

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
    if (KILL) return;

    this.angles[servoIndex] = angle;
    this.servos[servoIndex].to(angle);
  }

  async arpeggioDelay(accordAndDelays, { duration = 0 } = {}) {
    for (let value of accordAndDelays) {
      if (value > 20) {
        await delay(value);
      } else {
        this.swipeToOppositeSide(value);
        await delay(duration);
      }
    }
  }

  async onKill() {
    KILL = true;
    await delay(500);
    KILL = false;
  }

  async onMessage(message) {
    var messageInfo = {
      content: message.content,
      author: message.author.username,
    };

    this.win.webContents.send("messageDiscord", messageInfo);

    await this.onKill();

    // USER BIT

    switch (messageInfo.author) {
      case this.users[0]:
        // await this.arpeggio([11, 9, 7, 4]);
        await this.arpeggioDelay([0, 650, 0, 650, 0, 650, 0, 1500]);
        break;
      case this.users[1]:
        await this.arpeggioDelay([1, 650, 1, 650, 1, 650, 1, 1500]);
        break;
      case this.users[2]:
        // await this.arpeggioDelay([2, 650, 2, 650, 2, 650, 2, 1500]);
        break;
      case this.users[3]:
        await this.arpeggioDelay([3, 650, 3, 650, 3, 650, 3, 1500]);
        break;
      case this.users[4]:
        await this.arpeggioDelay([4, 650, 4, 650, 4, 650, 4, 1500]);
        break;
      case this.users[5]:
        await this.arpeggioDelay([5, 650, 5, 650, 5, 650, 5, 1500]);
        break;
      case this.users[6]:
        await this.arpeggioDelay([6, 650, 6, 650, 6, 650, 6, 1500]);
        break;
      case this.users[7]:
        await this.arpeggioDelay([7, 650, 7, 650, 7, 650, 7, 1500]);
        break;
      case this.users[8]:
        await this.arpeggioDelay([8, 650, 8, 650, 8, 650, 8, 1500]);
        break;
      case this.users[9]:
        await this.arpeggioDelay([9, 650, 9, 650, 9, 650, 9, 1500]);
        break;
      case this.users[10]:
        await this.arpeggioDelay([10, 650, 10, 650, 10, 650, 10, 1500]);
        break;
      case this.users[11]:
        await this.arpeggioDelay([11, 650, 11, 650, 11, 650, 11, 1500]);
        break;
    }

    // EMOJI BIT

   /* if (message.content === "all")
      return this.arpeggio([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    if (message.content === "👍") return this.arpeggio([11, 9, 7, 4]);

    if (message.content === "😂") return this.arpeggio([10, 8, 6, 3]);

    if (message.content === "😭") return this.arpeggio([9, 7, 5, 2]);

    if (message.content === "😍" || message.content === "❤️")
      return this.arpeggioDelay([8, 1000, 6, 800, 4, 600, 1, 1500]);

    if (message.content === "!") return this.arpeggio([7, 5, 3, 0]);

    if (message.content === "🎉") {
      //prettier-ignore
      await this.arpeggio([SI1, SI1, DO2, RE2, RE2, DO2, SI1, LA1, SOL1, SOL1, LA1, SI1, SI1, LA1, LA1]);
      await delay(700);
      //prettier-ignore
      await this.arpeggio([SI1, SI1, DO2, RE2, RE2, DO2, SI1, LA1, SOL1, SOL1, LA1, SI1, LA1, SOL1, SOL1]);
      return;
    }

    if (message.content === "✨") {
      //prettier-ignore
      await this.arpeggioDelay([MI2, 400, MI2,400,RE2,400,MI2,300,DO2,400,DO2, 400, SOL2,300,FA2,300,MI2,300,RE2,300,MI2,400, DO2,400,RE2,400,MI2,400,RE2,2450]);
      return;
    } */

    const cmdMap = {
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

    const [cmd, value] = message.content.split(" ");

    if (cmd in cmdMap) {
      const servoIndex = cmdMap[cmd];

      if (value === undefined) this.testServo(servoIndex);
      else this.toAngle(servoIndex, parseFloat(value));

      return;
    }

    if (message.content === "reset")
      return this.servos.each((servo, index) => this.toAngle(index, 65));

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
      "👍": async () => await this.arpeggio([11, 9, 7, 4]),
      "😂": async () => await this.arpeggio([10, 8, 6, 3]),
      "😭": async () => await this.arpeggio([9, 7, 5, 2]),

      "😍": async () =>
        await this.arpeggioDelay([8, 1000, 6, 800, 4, 600, 1, 1500]),
      "❤️": async () =>
        await this.arpeggioDelay([8, 1000, 6, 800, 4, 600, 1, 1500]),

      "!": async () => await this.arpeggio([7, 5, 3, 0]),

      "🎉": async () => {
        //prettier-ignore
        await this.arpeggio([SI1, SI1, DO2, RE2, RE2, DO2, SI1, LA1, SOL1, SOL1, LA1, SI1, SI1, LA1, LA1]);
        await delay(700);
        //prettier-ignore
        await this.arpeggio([SI1, SI1, DO2, RE2, RE2, DO2, SI1, LA1, SOL1, SOL1, LA1, SI1, LA1, SOL1, SOL1]);
        return;
      },

      "✨": async () => {
        //prettier-ignore
        await this.arpeggioDelay([MI2, 400, MI2,500,RE2,400,MI2,250,DO2,400,DO2, 300, SOL2,250,FA2,250,MI2,250,RE2,300,MI2,400, DO2,400,RE2,450,MI2,300,RE2,2450]);
        return;
      },
    };

    if (!(char in table)) return;
    await table[char]();
    await delay(2000);
  }
}

async function delay(millis = 0, ignore = KILL) {
  clearTimeout(timeoutCache);
  if (ignore) return;

  return new Promise(function (resolve) {
    timeoutCache = setTimeout(resolve, millis);
  });
}

module.exports = { DiscordBotServos };
