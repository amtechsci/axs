const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    uid: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        maxlength: 55,
        required: true
    },
    description: {
        type: String,
        maxlength: 155,
        required: true
    }
}, {
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    },
    collection: 'notification'
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;