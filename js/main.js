const { app, BrowserWindow } = require("electron");

let win = null;

function createWindow() {
    win = new BrowserWindow({
        //on peut regler plein de trucs, opacité de la fenêtre et tout
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile("indexServos.html");
    // win.setFullScreen(true);
    // win.maximize();
}

function initBot() {

    //SERVO HARP
     const { DiscordBotServos } = require("./DiscordBotServos");
     const config = require('../config.json')
    new DiscordBotServos(
        config.token,
        win
    );
}

app.allowRendererProcessReuse = false;
app.whenReady().then(createWindow).then(initBot);
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
