import { WebSocketServer } from "ws";
import fs from "fs";
import { spawn } from "child_process";
const pythonProcess = spawn('/usr/local/bin/python3',["../recog_exec.py"]);

const saveBase64 = (strData) => {
    fs.writeFile("./uploads/image_base64.txt", strData, (err) => {
        if (err)
            console.log(err);
        else
            console.log("File written successfully\n");
    });
};

const wss = new WebSocketServer({ port: 2121 });
wss.on("connection", function connection(ws) {
    ws.on("message", (base64String) => {
        console.log("Received base64 image");
        saveBase64(base64String);
    });

    pythonProcess.stdout.on('data', (data) => {
        console.log(data);
        ws.send(data.toString());
    });

    pythonProcess.on('error', (err) => {
        console.error('Error in Python process:', err);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
});
