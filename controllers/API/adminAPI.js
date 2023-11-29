const db = require('../../models');
const User = db.User;
const Notification = require('../../models/mongo/notification');
const Expert_chat = require('../../models/mongo/expert_chat');
const Category = db.Category;
const Preference = db.Preference;
const Get_subscription = db.Get_subscription;
const Experience = db.Experience;
const Task = db.Task;
const Booking = db.Booking;
const Review = db.Review;

module.exports = {
    update_profile_image: async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
    
            if (req.file) {
                user.profile_img = req.file.location;
                await user.save();
    
                res.status(200).send({
                    flag: true,
                    message: "Profile image updated successfully",
                });
            } else {
                res.status(400).send({ flag: false, message: "No image file provided" });
            }
        } catch (error) {
            console.error('Error in update_profile_image:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error ' + error
            });
        }
    },
};