const net = require("node:net");
const fs = require("node:fs/promises");
const path = require("node:path");

let fileHandle, fileStream;
const client = net.createConnection({
  host: "192.168.1.3",
  port: 3000,
});

client.on("connect", async () => {
  const FileNameProcess = process.argv[2];
  if (!FileNameProcess || FileNameProcess === undefined) {
    console.log("Please provide a file name");
    client.end();
    return;
  }
  console.log(
    "Welcome To 🚀 Uploder, we will upload your file with flash speed 🗲🗲"
  );
  fileHandle = await fs.open(FileNameProcess, "r");
  fileStream = fileHandle.createReadStream();
  let fileName = path.basename(FileNameProcess);
  const fileSize = (await fileHandle.stat()).size;
  let uploadedBytes = 0;
  let uploadedPercentage = 0;

  async function clearLine(count = 1) {
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => {
        process.stdout.moveCursor(0, -1, () => {
          process.stdout.clearLine(0, resolve);
        });
      });
    }
  }

  client.write(`fileName: ${fileName}-------`);

  let isFirstChunk = true;
  fileStream.on("data", async (data) => {
    if (!client.write(data)) {
      fileStream.pause(); // Pause the file stream, not the client
    }

    uploadedBytes += data.length;
    let percentage = Math.floor((uploadedBytes / fileSize) * 100);
    if (percentage > uploadedPercentage) {
      if (!isFirstChunk) {
        await clearLine();
      }
      console.log(`Uploading ${percentage}% complete...`);
      isFirstChunk = false;
    }
    uploadedPercentage = percentage;
  });

  client.on("drain", () => {
    fileStream.resume();
  });

  fileStream.on("end", () => {
    if (fileHandle) fileHandle.close();
    console.log(`File ${fileName} uploaded successfully!`);

    client.end();
  });
  console.log();
  
});

client.on("end", () => {
  if (fileHandle) fileHandle.close();
  console.log("Disconnected from server");
});
