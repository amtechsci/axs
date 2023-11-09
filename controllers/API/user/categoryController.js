const db = require('../../../models');
const User = db.User;
const Notification = require('../../../models/mongo/notification');
const Category = db.Category;
const Expert_category = db.Expert_category;
const Preference = db.Preference;
const Get_subscription = db.Get_subscription;
const Experience = db.Experience;
const Task = db.Task;
const Booking = db.Booking;
const Expert = db.Expert;

module.exports = {
    category: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const category = await Category.findAll();
            res.status(200).send({
                message: "Profile image updated successfully",
                data: {
                    category
                }
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    expert_category: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const expert_category = await Expert_category.findAll();
            res.status(200).send({
                message: "Category fetch successfully",
                data: {
                    expert_category
                }
            });
        } catch (error) {
            console.error('Error in getting category:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    notification: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            console.log("UserId Type:", typeof userId, "Value:", userId);
            const notifications = await Notification.find({ uid: userId });
            res.status(200).send({
                message: "Notification fetch successfully",
                data: {
                    notifications
                }
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    get_subscription: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const get_subscription = await Get_subscription.findAll();
            res.status(200).send({
                message: "Subscription fetch successfully",
                get_subscription
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    recommendations: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const preferences = await Preference.findAll({
                where:{uid:userId}
            });
            const preferenceCids = preferences.map(preference => preference.cid);
            const experiences = await Experience.findAll({
                attributes: ['id','title', 'location', 'images'],
                where: {
                    cid: preferenceCids
                }
            });
            res.status(200).send({
                message: "recommendations fetch successfully",
                "recommendations":experiences
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    recommendation_details: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const { rid } = req.query;
            const experiences = await Experience.findAll({
                where: {
                    id: rid
                }
            });
            res.status(200).send({
                message: "recommendation fetch successfully",
                "recommendations":experiences
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    task: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const task = await Task.findAll({
                where:{uid:userId}
            });
            res.status(200).send({
                message: "Task fetch successfully",
                task
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    task_details: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const { tid } = req.query;
            const task = await Task.findAll({
                where: {
                    id: tid
                }
            });
            res.status(200).send({
                message: "Task fetch successfully",
                task
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    booking: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const booking = await Booking.findAll({
                where:{uid:userId}
            });
            res.status(200).send({
                message: "Booking fetch successfully",
                booking
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    booking_details: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const { booking_id } = req.query;
            const booking = await Booking.findAll({
                where: {
                    id: booking_id
                },
                include: [{
                    model: Experience,
                    as: 'experience'
                }]
            });
            res.status(200).send({
                message: "Booking details fetched successfully",
                booking
            });
        } catch (error) {
            console.error('Error in booking_details:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    expert_list: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const expert = await Expert.findAll();
            res.status(200).send({
                message: "Expert fetch successfully",
                expert
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
};
