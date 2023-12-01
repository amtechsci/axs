const WebSocket = require('ws');

function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket');

        ws.on('message', (message) => {
            console.log('Received:', message);
            ws.send(`Echo: ${message}`);
            // Handle WebSocket messages here
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}

module.exports = setupWebSocketServer;
