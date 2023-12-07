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
                        const category = await db.Category.findByPk(data.message);
                        chatdata = await db.Chat.create({uid:user.id,is_chat_bot_active:1, category_id: category.id});
                        chat_id = chatdata.id;
                        const category_string = JSON.stringify({"message":"Welcome to AXS! Please select a category from below to continue", "percentage": "0"});
                        await Bot_chat.create({uid:0,chat_id,sender:'assistant',message:category_string});
                        if(category.parent_id != 0){
                            const parent_category = await db.Category.findByPk(category.parent_id);
                            await Bot_chat.create({uid:user.id,chat_id,sender:'user', message: JSON.stringify({"message":parent_category.category_name})});
                            const sub_category_string = JSON.stringify({"message":"Ok thank you, Please choose a sub category from below to continue.", "percentage": "0"});
                            await Bot_chat.create({uid:0,chat_id,sender:'assistant',message:sub_category_string});
                        }

                        Bot_chat.create({uid:user.id,chat_id,sender:'user',message:JSON.stringify({"message":category.category_name})});
 
                        await db.Chat.findByPk(chat_id).then( async (chat) => {
                            if (chat) {
                                const message = await chatgpt.send_message(chat_id)
                                ws.send(JSON.stringify({uid:0,chat_id,message:message.message, is_chat_bot_active : chatdata.is_chat_bot_active, created_at : new Date()}));
                                if(message.message !== null && message.message !== undefined) {
                                    
                                    if(message.lifeCycleEvent === 1) {
                                        // switch to live human agent by making a chat notification request to backend.
                                        const ticket = await db.Ticket.create({uid:chatdata.uid,chat_id,task_id:null});
                                        await chatdata.update({is_chat_bot_active:0});
                                    }
                                    else if(message.lifeCycleEvent === 2) {
                                        // create a task and ticket
                                        const category = await db.Category.findByPk(chatdata.category_id);
                                        const descriptionGPT = await chatgpt.description(chat_id)
                                        const description = JSON.parse(descriptionGPT)
                                        const task = await db.Task.create({uid:chatdata.uid,title:category.category_name,description: description.message, type: "ticket"});
                                        const ticket = await db.Ticket.create({uid:chatdata.uid,chat_id,task_id:task.id});
                                        await chatdata.update({is_chat_bot_active:0});
                                    }
                                    await Bot_chat.create({uid:0,chat_id,sender:'assistant',message:message.message});
                                }
                            return chat.update({ prompt: category.prompt });

                            } else {
                            console.log("Chat record not found");
                            }
                        });
                    }
                    else{
                        chat_id = data.chat_id;
                        chatdata = await db.Chat.findByPk(chat_id);

                        if(chatdata.is_chat_bot_active == 1){
                            await Bot_chat.create({uid:user.id,chat_id,sender:'user',message: JSON.stringify({"message":data.message})});
                            const message = await chatgpt.send_message(chat_id)
                            ws.send(JSON.stringify({uid:0,chat_id,message:message.message, is_chat_bot_active : chatdata.is_chat_bot_active, created_at : new Date()}));
                            if(message.message !== null && message.message !== undefined) {

                                console.log(message.lifeCycleEvent)
                                if(message.lifeCycleEvent === 1) {
                                    // switch to live human agent by making a chat notification request to backend.
                                    await chatdata.update({is_chat_bot_active:0});
                                    const ticket = await db.Ticket.create({uid:chatdata.uid,chat_id,task_id:null}).then( async (ticket, error) => {
                                        if(error){
                                            console.log(error);
                                        }

                                        console.log(ticket);
                                    });
                                  
                                }
                                else if(message.lifeCycleEvent === 2) {
                                    // create a task and ticket
                                    const category = await db.Category.findByPk(chatdata.category_id);
                                    console.log(chatdata.category_id);
                                    const descriptionGPT = await chatgpt.description(chat_id)
                                    const description = JSON.parse(descriptionGPT)
                                    const task = await db.Task.create({uid:chatdata.uid,title:category.category_name,description: description.message, type: "ticket"});
                                    const ticket = await db.Ticket.create({uid:chatdata.uid,chat_id,task_id:task.id});
                                    console.log(ticket);
                                    console.log(task);
                                    await chatdata.update({is_chat_bot_active:0});
                                }
                                await Bot_chat.create({uid:0,chat_id,sender:'assistant',message:message.message});
                            }

                        
                           
                         }
                         else{
                            await Bot_chat.create({uid:user.id,chat_id,sender:user_tpye,message:JSON.stringify({"message":data.message})});

                            if(user_tpye == "user"){
                                ticket = await db.Ticket.findOne({where:{chat_id}})
                                console.log(ticket);
                                if(ticket.executive_id != null){
                                clients.get("executive#"+ticket.executive_id).ws.send(JSON.stringify({uid:ticket.executive_id,chat_id,
                                    message:JSON.stringify({"message":data.message}), created_at : new Date(), is_chat_bot_active : chatdata.is_chat_bot_active}));
                                }
                                
                            }
                            else{
                                clients.get("user#"+chatdata.uid).ws.send(JSON.stringify({uid:chatdata.uid,chat_id,
                                    message:JSON.stringify({"message":data.message}), created_at : new Date(), is_chat_bot_active : chatdata.is_chat_bot_active}));
                            }
                         }
                    }
                }
            } catch (error) {
                console.error('Error in WebSocket message event:', error);
                ws.send(JSON.stringify({ error: 'An error occurred: '+error, message : "There was an error in completing your request, please try again!" , created_at : new Date()}));
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}

module.exports = setupWebSocketServer;