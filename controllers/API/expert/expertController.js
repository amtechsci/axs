const db = require('../../../models');
const User = db.User;
const Expert_chat = require('../../../models/mongo/expert_chat');
const Task = db.Task;
const Review = db.Review;

module.exports = {
    create_pin: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { pin } = req.body;
            user.pin = pin;
            await user.save();
            let new_user = user.name ? 0 : 1;
            res.status(200).json({
                flag:true,
                message: "Pin updated successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    gender: user.gender,
                    profile_img: user.profile_img,
                    new_user
                }
            });
        } catch (error) {
            console.error('Error in create_pin:', error);
            res.status(500).json({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    pin_login: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) { return res.status(404).json({flag:false, message: "User not found" }); }
            const { pin } = req.body;
            if(user.pin == pin){
                res.status(200).json({
                    flag:true,
                    message: "Pin match",
                });
            }else{
                res.status(200).json({
                    flag:false,
                    message: "Pin not match",
                });
            }
        } catch (error) {
            console.error('Error in create_pin:', error);
            res.status(500).json({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    setup_profile: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) { return res.status(404).json({flag:false, message: "User not found" }); }
            const { pin } = req.body;
            if(user.pin == pin){
                res.status(200).json({
                    flag:true,
                    message: "Pin match",
                });
            }else{
                res.status(200).json({
                    flag:false,
                    message: "Pin not match",
                });
            }
        } catch (error) {
            console.error('Error in create_pin:', error);
            res.status(500).json({
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
                where:{expert_id:userId}
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
};
