const WebSocket = require('ws');
const db = require('../models');
const chatgpt = require('../models/chatgpt');
const Bot_chat = require('../models/mongo/bot_chat');
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
                    let chat_id;
                    let chatdata;
                    if(data.chat_id !== null){
                        chat_id = data.chat_id;
                        chatdata = await db.Chat.findByPk(chat_id);
                        Bot_chat.create({uid:user.id,chat_id,sender:'user',message:data.message});
                    }else{
                        chatdata = await db.Chat.create({uid:user.id,is_chat_bot_active:1});
                        chat_id = chatdata.id;
                        const category_string = "Welcome! Please select a category from below to continue";
                        Bot_chat.create({uid:0,chat_id,sender:'bot',message:category_string});
                        const category = await db.Category.findByPk(data.message);
                        if(category.parent_id != 0){
                            const parent_category = await db.Category.findByPk(category.parent_id);
                            Bot_chat.create({uid:user.id,chat_id,sender:'user',message:parent_category.category_name});
                            const sub_category_string = "Ok thank you, Please choose a sub category from below to continue.";
                            Bot_chat.create({uid:0,chat_id,sender:'bot',message:sub_category_string});
                        }
                        Bot_chat.create({uid:user.id,chat_id,sender:'user',message:category.category_name});
                        db.Chat.findByPk(chat_id).update({prompt:category.prompt});
                    }
                    if(chatdata.is_chat_bot_active == 1){
                        let bot_mess = "Hii";
                        ws.send(JSON.stringify({uid:0,chat_id,message:bot_mess}));
                    }else{
                        // send this message to ex
                        // ws.send();
                    }
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
