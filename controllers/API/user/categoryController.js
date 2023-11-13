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
const Plan_features = db.Plan_features;

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
                flag:true,
                message: "category fetch successfully",
                data: {
                    categories
                }
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                    category_type: 2,parent_id: ccid,
                },
                limit: pageSize, // Set the number of records to return per page
                offset: (cpage - 1) * pageSize // Calculate the offset based on the current page
            });
            res.status(200).send({
                flag:true,
                message: "category fetch successfully",
                data: {
                    categories
                }
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                flag:true,
                message: "Notification fetch successfully",
                data: {
                    notifications
                }
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
    
            const subscriptions = await Get_subscription.findAll();
            const plan_features = await Plan_features.findAll({
                attributes: ['id','title']
            });
    
            // Grouping subscriptions by plan_type
            const groupedSubscriptions = subscriptions.reduce((acc, item) => {
                // Use plan_type as the key
                const key = item.plan_type;
    
                // Initialize the array if not already
                if (!acc[key]) {
                    acc[key] = [];
                }
    
                // Add the current item to its respective group
                acc[key].push(item);
    
                return acc;
            }, {});
    
            res.status(200).send({
                flag: true,
                message: "Subscription fetch successfully",
                subscriptions: groupedSubscriptions,
                "features":plan_features
            });
        } catch (error) {
            console.error('Error in get_subscription:', error);
            res.status(500).send({
                flag: false,
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
                flag:true,
                message: "recommendations fetch successfully",
                "recommendations":experiences
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                flag:true,
                message: "recommendation fetch successfully",
                "recommendations":experiences
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                flag:true,
                message: "Task fetch successfully",
                task
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                flag:true,
                message: "Task fetch successfully",
                task
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                where: { uid: userId },
                include: [{
                  model: Experience,
                  as: 'experience'
                }]
            });              
            res.status(200).send({
                flag:true,
                message: "Booking fetch successfully",
                booking
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                flag:true,
                message: "Booking details fetched successfully",
                booking
            });
        } catch (error) {
            console.error('Error in booking_details:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
};
