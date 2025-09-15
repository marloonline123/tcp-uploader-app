const net = require('node:net');
const fs = require('node:fs/promises');

const server = net.createServer();

let fileHandle, fileStream;
server.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('data', async (data) => {
        fileHandle = await fs.open('./storage/test.txt', 'w')
        fileStream = fileHandle.createReadStream();

        fileHandle.write(data)
        console.log(`Client sent data`);
    });
    
    socket.on('drain', () => {
        
    });

    socket.on('end', () => {
        fileHandle.close();
        console.log('Client disconnected');
    });
});


server.listen(3000, () => {
    console.log('Server listening on port 3000');
});