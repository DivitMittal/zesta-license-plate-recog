import { WebSocketServer } from "ws";
import { decode } from "base64-arraybuffer";
import fs from "fs";

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
});
