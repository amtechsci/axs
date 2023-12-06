const WebSocket = require('ws');
const db = require('../models');
const chatgpt = require('../controllers/API/chatGPT/chatgpt');
const Bot_chat = require('../models/mongo/bot_chat');
const jwt = require('jsonwebtoken');

function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });
    const clients = new Map();
    const generateUniqueId = () => Math.random().toString(36).substr(2, 9);
    wss.on('connection', (ws) => {
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                const token = data.token;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                var user_tpye = decoded.type;
                var user;
                var us;
                if(user_tpye == "user"){
                    user = await db.User.findByPk(decoded.id);
                    us = "user#"+user.id;
                }else{
                    user = await db.Executive.findByPk(decoded.id);
                    us = "executive#"+user.id;
                }
                clients.set(us, ws);
                if (!user) {
                    ws.send(JSON.stringify({ message: "User not found" }));
                } else if (user.device_id.toString() !== decoded.device_id.toString()) {
                    ws.send(JSON.stringify({ message: "Invalid or expired token" }));
                } else {
                    let chat_id;
                    let chatdata;
                    if(data.chat_id == null){
                        chatdata = await db.Chat.create({uid:user.id,is_chat_bot_active:1});
                        chat_id = chatdata.id;
                        const category_string = "Welcome to AXS! Please select a category from below to continue";
                        await Bot_chat.create({uid:0,chat_id,sender:'assistant',message:category_string});
                        const category = await db.Category.findByPk(data.message);
                        if(category.parent_id != 0){
                            const parent_category = await db.Category.findByPk(category.parent_id);
                            await Bot_chat.create({uid:user.id,chat_id,sender:'user',message:parent_category.category_name});
                            const sub_category_string = "Ok thank you, Please choose a sub category from below to continue.";
                            await Bot_chat.create({uid:0,chat_id,sender:'assistant',message:sub_category_string});
                        }
                        Bot_chat.create({uid:user.id,chat_id,sender:'user',message:category.category_name});
                        await db.Chat.findByPk(chat_id).then((chat) => {
                            if (chat) {
                            return chat.update({ prompt: category.prompt });
                            } else {
                            console.log("Chat record not found");
                            }
                        });
                    }else{
                        chat_id = data.chat_id;
                        chatdata = await db.Chat.findByPk(chat_id);
                        if(chatdata.is_chat_bot_active == 1){
                            Bot_chat.create({uid:user.id,chat_id,sender:'user',message:data.message});
                            const message = await chatgpt.send_message(chat_id)
                            if(message.message !== null && message.message !== undefined) {
                                if(message.lifeCycleEvent === 1) {
                                    const category = await db.Category.findByPk(chatdata.category_id);
                                    const description = await chatgpt.description(chat_id)
                                    const task = await db.Task.create({title:category.category_name,description});
                                    const ticket = await db.Ticket.create({uid:chatdata.uid,chat_id,task_id:task.id});
                                    chatdata.update({is_chat_bot_active:0});
                                }
                                else if(message.lifeCycleEvent === 2) {
                                    // create a task and ticket
                                    // createTaskTicket(user_id, chat_id, message.chatPrompts)
                                }
                                await Bot_chat.create({uid:0,chat_id,sender:'assistant',message:message.message});
                            }
                            ws.send(JSON.stringify({uid:0,chat_id,message:message.message}));
                         }else{
                            await Bot_chat.create({uid:user.id,chat_id,sender:user_tpye,message:data.message});
                            chatdata
                            if(user_tpye == "user"){
                                ticket = await db.Ticket.findOne({where:{chat_id}})
                                clients.get("executive#"+ticket.executive_id).ws.send(JSON.stringify({uid:ticket.executive_id,chat_id,message:data.message}));
                            }else{
                                clients.get("user#"+chatdata.uid).ws.send(JSON.stringify({uid:chatdata.uid,chat_id,message:data.message}));
                            }
                         }
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