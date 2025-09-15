# 🚀 Uploader App 🗲

A simple and fast file uploader application built with Node.js, allowing you to transfer files from a client to a server over TCP.

## ✨ Features

- **File Upload:** Transfer files from the client to the server.
- **Progress Bar:** See real-time upload progress.
- **Unique Filenames:** The server automatically handles filename conflicts by appending a random number to avoid overwriting files.
- **Efficient Streaming:** Files are streamed to ensure low memory usage, even for large files.

## 📋 Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)

## ⚙️ Installation & Setup

1.  **Clone the repository or download the source code.**

2.  **Navigate to the project directory:**
    ```bash
    cd uploader-app
    ```

3.  **Update IP Address (if necessary):**
    By default, the client is configured to connect to `192.168.1.3` on port `3000`. You may need to change this in both `server.js` and `client.js` to match your server's local IP address.

    In [`server.js:80`](./server.js:80):
    ```javascript
    server.listen(3000, "YOUR_SERVER_IP_HERE", () => {
      console.log("Server listening on port 3000", server.address());
    });
    ```

    In [`client.js:7`](./client.js:7):
    ```javascript
    const client = net.createConnection({
      host: "YOUR_SERVER_IP_HERE",
      port: 3000,
    });
    ```

## 🚀 How to Use

1.  **Start the server:**
    Open a terminal and run the following command to start the server. It will begin listening for incoming connections.

    ```bash
    node server.js
    ```

2.  **Upload a file from the client:**
    Open a **new terminal** and use the following command to upload a file. Replace `path/to/your/file.ext` with the actual path to the file you want to upload.

    ```bash
    node client.js path/to/your/file.ext
    ```
    For example:
    ```bash
    node client.js video.mp4
    ```

3.  **View your uploaded files:**
    Uploaded files are saved in the `storage/` directory.

## 📂 Project Structure

```
.
├── 📁 storage/         # Directory for uploaded files
├── 📜 client.js       # The client-side application
├── 📜 server.js       # The server-side application
└── 📜 README.md       # This file
```

---

<p align="center">Made with ❤️</p>