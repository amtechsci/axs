const WebSocket = require('ws');
const db = require('../models');
const jwt = require('jsonwebtoken');

function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket');

        ws.on('message', async (message) => {
            try {
                // Parse the incoming message as JSON
                const data = JSON.parse(message);
                const token = data.token; // Extract the token from the parsed data

                // Verify and decode the token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await db.User.findByPk(decoded.id);

                if (!user) {
                    ws.send(JSON.stringify({ message: "User not found" }));
                } else if (user.device_id.toString() !== decoded.device_id.toString()) {
                    ws.send(JSON.stringify({ message: "Invalid or expired token" }));
                } else {
                    // if(data.chat_id == 0){
                    //     data
                    // }else{
                    //     data;
                    // }
                    ws.send('User ' + user.name + ' Send:' + data.message);
                }
            } catch (error) {
                console.error('Error in WebSocket message event:', error);
                ws.send(JSON.stringify({ error: 'An error occurred' }));
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}

module.exports = setupWebSocketServer;
