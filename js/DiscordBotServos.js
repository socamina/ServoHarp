const { Client, MessageEmbed } = require("discord.js");
const { Board, Servo} = require("johnny-five");

class DiscordBotServos {
  constructor(token, win) {
    console.log("Bot start");

    this.win = win;
    this.client = new Client();
    this.client.on("ready", this.onReady.bind(this));
    this.client.on("message", this.onMessage.bind(this));
    this.client.login(token);
    this.users = [];
    this.initArduino();
  }

  initArduino(){
    this.board = new Board({repl:false});
    this.board.on("ready", this.onBoardReady.bind(this));
    console.log("BOARD STARTED")
  }
  
  onBoardReady(){
    console.log("Board ready");
    //this.servo = new Servo(7);

    this.servo1 = new Servo(3);
    this.servo2 = new Servo(4);
    this.servo3 = new Servo(5);
    this.servo4 = new Servo(6);
    // this.servo5 = new Servo(6);
    // this.servo6 = new Servo(5);
    // this.servo7= new Servo(4);
    // this.servo8 = new Servo(3);

  //   this.servo1.center();
  //   this.servo2.center();
  //   this.servo3.center();
  //   this.servo4.center();
  //   this.servo5.center();
  //   this.servo6.center();
  //   this.servo7.center();
  //   this.servo8.center();
  //  delay(100);   

    this.angle1 = 0;
    this.angle2 = 0;
    this.angle3 = 0;
    this.angle4 = 0;
    this.angle5 = 0;
    this.angle6 = 0;
    this.angle7 = 0;
    this.angle8 = 0;
  }

  onReady() {
    console.log("BOT READY");
  }

  onMessage(message) {
    const receivedEmbed = message.embeds[0];
    //console.log(message.content);
    //console.log("YO")

    if(receivedEmbed){
      this.win.webContents.send("messageDiscord", receivedEmbed);
    } else {
      this.win.webContents.send("messageDiscord", message.content);

      var members = message.guild.members;
      members.fetch().then(data => {
        data.forEach(member => {
          this.users.push(member);
        });
          for(let i=0; i<this.users.length; i++){
            //console.log(this.users[i].username);
           // console.log(this.users[i].user.id);
            console.log(this.users[i].user.username);
          }
          //console.log(`Added ${member.displayName} to users`);
        });
        //console.log(this.users.length);
        
     
      


      if(this.angle1==0 && message.content == "1"){
        this.angle1+=30
        this.servo1.to(this.angle1);
        console.log(this.angle1);
      } else if(this.angle1==30 && message.content == "1"){
        this.angle1-=30
        this.servo1.to(this.angle1);
        console.log(this.angle1);
      } 

      if(this.angle2==0  && message.content == "2"){
        //this.servo.sweep();
        //console.log(this.servo);
        this.angle2+=30
        this.servo2.to(this.angle2);
        console.log(this.angle2);
      } else if(this.angle2==30 && message.content == "2"){
        this.angle2-=30
        this.servo2.to(this.angle2);
        console.log(this.angle2);
      } 

      if(this.angle3==0  && message.content == "3"){
        //this.servo.sweep();
        //console.log(this.servo);
        this.angle3+=30
        this.servo3.to(this.angle3);
        console.log(this.angle3);
      } else if(this.angle3>=30 && message.content == "3"){
        this.angle3-=30
        this.servo3.to(this.angle3);
        console.log(this.angle3);
      } 


      if(this.angle4==0  && message.content == "4"){
        //this.servo.sweep();
        //console.log(this.servo);
        this.angle4+=30
        this.servo4.to(this.angle4);
        console.log(this.angle4);
      } else if( this.angle4==30 && message.content == "4"){
        this.angle4-=30
        this.servo4.to(this.angle4);
        console.log(this.angle4);
      } 

      if(this.angle5 == 0 && message.content == "5"){
        //this.servo.sweep();
        //console.log(this.servo);
        this.angle5+=20
        this.servo5.to(this.angle5);
        console.log(this.angle5);
      } else if(this.angle5==30 && message.content == "5"){
        this.angle5-=30
        this.servo5.to(this.angle5);
        console.log(this.angle5);
      } 


      if(this.angle6 == 0 && message.content == "6"){
        //this.servo.sweep();
        //console.log(this.servo);
        this.angle6+=20
        this.servo6.to(this.angle6);
        console.log(this.angle6);
      } else if(this.angle6==30 && message.content == "6"){
        this.angle6-=30
        this.servo6.to(this.angle6);
        console.log(this.angle6);
      } 


      if(this.angle7 == 0 && message.content == "7"){
        //this.servo.sweep();
        //console.log(this.servo);
        this.angle7+=20
        this.servo7.to(this.angle7);
        console.log(this.angle7);
      } else if (this.angle7==30 && message.content == "7"){
        this.angle7-=30
        this.servo7.to(this.angle7);
        console.log(this.angle7);
      } 

      if(this.angle8 == 0 && message.content == "8"){
        //this.servo.sweep();
        //console.log(this.servo);
        this.angle8+=20
        this.servo8.to(this.angle8);
        console.log(this.angle8);
      } else if (this.angle8==30 && message.content == "8"){
        this.angle8-=30
        this.servo8.to(this.angle8);
        console.log(this.angle8);
      } 

      // if(message.content == "R"){
     
      //   this.angle-=10
      //   this.servo.to(this.angle);
      //   console.log(this.angle);
      // }
    }

    this.users = [];
  }
}

module.exports = { DiscordBotServos };