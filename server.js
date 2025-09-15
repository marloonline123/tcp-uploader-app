const net = require('node:net');
const fs = require('node:fs/promises');

const server = net.createServer();

async function checkUniqueName(fileName) {
    if (!fileName) return Date.now().toString();
    const files = await fs.readdir('./storage');
    if (files.includes(fileName)) {
        const dotIndex = fileName.lastIndexOf('.');
        if (dotIndex === -1) {
            // No extension, just append
            return checkUniqueName(fileName + Math.floor(Math.random() * 1000));
        } else {
            const name = fileName.substring(0, dotIndex);
            const ext = fileName.substring(dotIndex);
            return checkUniqueName(name + Math.floor(Math.random() * 1000) + ext);
        }
    }
    return fileName;
}

server.on('connection', (socket) => {
    let fileHandle, fileStream, fileName;
    let receivedData = Buffer.alloc(0); // Buffer to accumulate incoming data
    console.log('Client connected');

    socket.on('data', async (data) => {
        if (!fileStream) {
            receivedData = Buffer.concat([receivedData, data]);
            const separator = '-------';

            if (!fileName) {
                const indexOfSeparator = receivedData.indexOf(separator);
                if (indexOfSeparator !== -1) {
                    fileName = await checkUniqueName(receivedData.subarray(10, indexOfSeparator).toString('utf-8'));
                    console.log('fileName', fileName);
                    receivedData = receivedData.subarray(indexOfSeparator + separator.length);
                } else {
                    return; // Wait for more data to get the full header and separator
                }
            }

            fileHandle = await fs.open(`./storage/${fileName}`, 'w');
            fileStream = fileHandle.createWriteStream();

            // Write the initial part of the file
            if (receivedData.length > 0) {
                if (!fileStream.write(receivedData)) {
                    socket.pause();
                }
                receivedData = Buffer.alloc(0); // Clear the buffer
            }

            fileStream.on("drain", () => socket.resume());
        } else {
            if (!fileStream.write(data)) {
                socket.pause();
            }
        }
        console.log('Client sent data');
    });

    socket.on('end', () => {
        if(fileHandle) fileHandle.close();
        fileHandle = null;
        fileStream = null;
        console.log('Client disconnected');
    });

    socket.on('error', () => {
        if(fileHandle) fileHandle.close();
        fileHandle = null;
        fileStream = null;
        console.log('Client disconnected');
    });
});


server.listen(3000, "192.168.1.3", () => {
  console.log("Server listening on port 3000", server.address());
});