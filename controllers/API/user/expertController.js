const db = require('../../../models');
const User = db.User;
const Expert_chat = require('../../../models/mongo/expert_chat');
const Task = db.Task;
const Review = db.Review;
const Expert_skills = db.Expert_skills;

module.exports = {
    expert_list: async (req, res) => {
        try {
            const user = req.user;
            const expert = await User.findAll({where:{"user_type":2}});
            res.status(200).send({
                flag:true,
                message: "Expert fetch successfully",
                expert
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    expert_profile: async (req, res) => {
        try {
            const user = req.user;
            const { expert_id } = req.query;
            const expert = await User.findOne({where:{"id":expert_id,"user_type":2}});
            const expert_skills = await Expert_skills.findAll({attributes: ['cid','experience', 'price'],where:{"uid":expert_id}});
            const total_review = await Review.count({where:{"uid":expert_id}});
            const total_task = await Task.count({where:{expert_id}});
            res.status(200).send({
                flag:true,
                message: "Expert fetch successfully",
                "data":{expert,total_review,total_task,"hours_worked":50,expert_skills}
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    expert_chat: async (req, res) => {
        try {
            const user = req.user;
            const { expert_id } = req.query;
            const chat = await Expert_chat.find({"uid":user.id,expert_id});
            res.status(200).send({
                flag:true,
                message: "Chat fetch successfully",
                chat
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    expert_message: async (req, res) => {
        try {
            const user = req.user;
            const { expert_id } = req.query;
            const { message } = req.body;
            await Expert_chat.create({"uid":user.id,expert_id,sender:1,message});
            res.status(200).send({
                flag:true,
                message: "Message sent"
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    add_review: async (req, res) => {
        try {
            const user = req.user;
            const { expert_id } = req.query;
            const { message } = req.body;
            await Expert_chat.create({"uid":user.id,expert_id,sender:1,message});
            res.status(200).send({
                flag:true,
                message: "Message sent"
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
};
