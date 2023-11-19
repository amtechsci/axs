const mongoose = require('mongoose');

const bot_chatSchema = new mongoose.Schema({
    uid: {
        type: Number,
        required: true
    },
    chat_id: {
        type: Number,
        required: true
    },
    sender: {
        type: String,
        maxlength: 55,
        required: true
    },
    message: {
        type: String,
        maxlength: 155,
        required: true
    }
}, {
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    },
    collection: 'bot_chat'
});

const Bot_chat = mongoose.model('Bot_chat', bot_chatSchema);

module.exports = Bot_chat;