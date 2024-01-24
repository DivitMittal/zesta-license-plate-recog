import { WebSocketServer } from "ws";
import fs from "fs";
import { exec } from 'child_process';

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
    ws.on("open", () => {console.log("Client connected!!")});
    ws.on("message", (base64String) => {
        console.log("Received base64 image");
        saveBase64(base64String);
        fs.writeFile('./output.txt', " ", (err) => {if (err) console.log(err)});
        exec('pipenv run python3 ./recog_exec.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
        setTimeout(() => {
            console.log('This printed after about 1 second');
        }, 10000);
        fs.readFile('./output.txt', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              console.log(data);
              ws.send(data);
            }
        });
    });
});
