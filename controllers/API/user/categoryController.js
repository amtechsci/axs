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
const Task_status = db.Task_status;
const Booking_status = db.Booking_status;
const Executive = db.Executive;


module.exports = {
    category: async (req, res) => {
        try {
            const user = req.user;
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
            const user = req.user;
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
            const user = req.user;
            const notifications = await Notification.find({ uid: user.id });
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
            const user = req.user;
            const subscriptions = await Get_subscription.findAll();
            const plan_features = await Plan_features.findAll({
                attributes: ['id','title']
            });
            const groupedSubscriptions = subscriptions.reduce((acc, item) => {
                // Use plan_type as the key
                const key = item.plan_type;
                if (!acc[key]) {
                    acc[key] = [];
                }
                let feature = item.feature.split(",");
                item.feature = feature.map(str => {
                    return parseInt(str, 10);
                  });
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
            const user = req.user;
            const preferences = await Preference.findAll({
                where:{uid:user.id}
            });
            const preferenceCids = preferences.map(preference => preference.cid);
            const experiences = await Experience.findAll({
                attributes: ['id','title', 'location', 'images'],
                where: {
                    cid: preferenceCids
                }
            });
            experiences.map(experience => {experience.images = experience.images.split(",")[0];});
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
            const user = req.user;
            const { rid } = req.query;
            const experiences = await Experience.findOne({
                where: {
                    id: rid
                }
            });
            experiences.images = experiences.images.split(",");
            experiences.things_to_do = experiences.things_to_do.split(",\n");
            // experiences.images = images.map(str => {
            //         return parseInt(str, 10);
            //       });
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
            const user = req.user;
            const task = await Task.findAll({
                where:{uid:user.id}
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
            const user = req.user;
            const { tid } = req.query;
            const task = await Task.findOne({
                where: {
                    id: tid
                }
            });
    
            if (!task) {
                return res.status(404).send({
                    flag: false,
                    message: "Task not found"
                });
            }
            let expert;
            if(task.type == "ticket"){
                expert = await Executive.findOne({

                    where: { id: task.executive_id }
                });
            }else{
                expert = await User.findOne({

                    where: { id: task.expert_id }
                });
            }
            const category = await Category.findOne({
                where: { id: task.cid }
            });
            const task_status = await Task_status.findAll({
                attributes: ['status','created_at'],
                where: { task_id: task.id }
            });
            
            const response = {
                ...task.dataValues,
                category_name: category ? category.category_name : null,
                category_img: category ? category.category_img : null,
                expert: expert ? expert.dataValues : null,
                task_status: task_status ? task_status : []
            };
    
            res.status(200).send({
                flag: true,
                message: "Task fetched successfully",
                task: response
            });
        } catch (error) {
            console.error('Error in task_details:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },    
    booking: async (req, res) => {
        try {
            const user = req.user;
            const booking = await Booking.findAll({
                where: { uid: user.id },
                include: [{
                  model: Experience,
                  as: 'experience'
                }]
            });
            booking.map(bookin => {
                bookin.experience.images = bookin.experience.images.split(",")[0];
                bookin.experience.things_to_do = bookin.experience.things_to_do.split(",\n");
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
            const user = req.user;
            const { booking_id } = req.query;
            const booking = await Booking.findOne({
                where: {
                    id: booking_id
                },
                include: [{
                    model: Experience,
                    as: 'experience'
                }]
            });
            
            booking.experience.images = booking.experience.images.split(",");
            booking.experience.things_to_do = booking.experience.things_to_do.split(",\n");
            const category = await Category.findOne({
                where: { id: booking.experience.cid }
            });
            const booking_status = await Booking_status.findOne({
                attributes: ['status','created_at'],
                where: { id: booking.id }
            });
            const response = {
                ...booking.dataValues,
                category_name: category ? category.category_name : null,
                category_img: category ? category.category_img : null,
                booking_status: booking_status ? booking_status.dataValues : []
            };
            res.status(200).send({
                flag:true,
                message: "Booking details fetched successfully",
                response
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
