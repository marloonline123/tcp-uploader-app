const net  = require('node:net');
const fs = require('node:fs/promises');

let fileHandle, fileStream;
const client = net.createConnection({
    host: 'localhost',
    port: 3000
});

client.on("connect", async () => {
  fileHandle = await fs.open("./text.txt", "r");
  fileStream = fileHandle.createReadStream();
  fileStream.on("data", (data) => {
    client.write(data);
  });

  fileStream.on('end', () => {
    client.end();
  });
  console.log("Connected to server");
});

client.on('end', () => {
    fileHandle.close();
    console.log('Disconnected from server');
});