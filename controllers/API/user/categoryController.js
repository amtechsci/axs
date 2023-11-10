const db = require('../../../models');
const User = db.User;
const Notification = require('../../../models/mongo/notification');
const Expert_chat = require('../../../models/mongo/expert_chat');
const Category = db.Category;
const Preference = db.Preference;
const Get_subscription = db.Get_subscription;
const Experience = db.Experience;
const Task = db.Task;
const Booking = db.Booking;
const Review = db.Review;

module.exports = {
    category: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const { cid, page } = req.query;
            let ccid = cid ? cid : 0;
            let cpage = page ? parseInt(page) : 1; // Ensure that the page is an integer
            let pageSize = 50;
            const categories = await Category.findAll({
                where: {
                  category_type: 1,parent_id: ccid,
                },
                limit: pageSize, // Set the number of records to return per page
                offset: (cpage - 1) * pageSize // Calculate the offset based on the current page
            });
            res.status(200).send({
                message: "category fetch successfully",
                data: {
                    categories
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
            const { cid, page } = req.query;
            let ccid = cid ? cid : 0;
            let cpage = page ? parseInt(page) : 1; // Ensure that the page is an integer
            let pageSize = 50;
            const categories = await Category.findAll({
                where: {
                    category_type: 1,parent_id: ccid,
                },
                limit: pageSize, // Set the number of records to return per page
                offset: (cpage - 1) * pageSize // Calculate the offset based on the current page
            });
            res.status(200).send({
                message: "category fetch successfully",
                data: {
                    categories
                }
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
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
            const expert = await User.findAll({where:{"user_type":2}});
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
    expert_profile: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            const { expert_id } = req.query;
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const expert = await User.findAll({where:{"id":expert_id,"user_type":2}});
            const total_review = await Review.count({where:{"uid":expert_id}});
            const total_task = await Task.count({where:{expert_id}});
            res.status(200).send({
                message: "Expert fetch successfully",
                "data":{expert,total_review,total_task,"hours_worked":50}
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    expert_chat: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            const { expert_id } = req.query;
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const chat = await Expert_chat.find({"uid":user.id,expert_id});
            res.status(200).send({
                message: "Chat fetch successfully",
                chat
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    expert_message: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            const { expert_id } = req.query;
            const { message } = req.body;
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            await Expert_chat.create({"uid":user.id,expert_id,sender:1,message});
            res.status(200).send({
                message: "Message sent"
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
};
