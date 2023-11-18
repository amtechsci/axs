const mongoose = require('mongoose');

const expert_chatSchema = new mongoose.Schema({
    uid: {
        type: Number,
        required: true
    },
    expert_id: {
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
    collection: 'expert_chat'
});

const Expert_chat = mongoose.model('Expert_chat', expert_chatSchema);

module.exports = Expert_chat;