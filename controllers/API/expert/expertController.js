const db = require('../../../models');
const User = db.User;
const Expert_chat = require('../../../models/mongo/expert_chat');
const Task = db.Task;
const Review = db.Review;
const Expert_documents = db.Expert_documents;
const Category = db.Category;
const Expert_skills = db.Expert_skills;
const Expert_slots = db.Expert_slots;
const Expert_bank_account = db.Expert_bank_account;
const Withdraw = db.Withdraw;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

module.exports = {
    create_pin: async (req, res) => {
        try {
            const user = req.user;
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
            const user = req.user;
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
    update_document: async (req, res) => {
        try {
            const user = req.user;
            if (req.file) {
                const { document_name } = req.body;
                document_file = req.file.location;
                await Expert_documents.create({"uid":user.id,document_name,document_file});
                res.status(200).send({
                    flag: true,
                    message: "Document updated successfully",
                });
            } else {
                res.status(400).send({ flag: false, message: "No document file provided" });
            }
        } catch (error) {
            console.error('Error in update_profile_image:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error ' + error
            });
        }
    },
    get_user: async (req, res) => {
        try {
            const user = req.user;
                res.status(200).send({
                    flag:true,
                    message: "User data successfully",
                    user
                });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    wallet: async (req, res) => {
        try {
            const user = req.user;
                res.status(200).send({
                    flag:true,
                    message: "User data successfully",
                    "wallet":user.wallet
                });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    setup_profile: async (req, res) => {
        try {
            const user = req.user;
            const { name, description, gender, category_id, experience } = req.body;
            user.name = name;
            user.description = description;
            user.gender = gender;
            await user.save();
            await Expert_skills.create({"uid":user.id,"cid":category_id,"experience":experience});
            res.status(200).send({
                flag:true,
                message: "Profile updated successfully",
            });

        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    edit_profile: async (req, res) => {
        try {
            const user = req.user;
            const { name, email, mobile, address } = req.body;
            user.name = name;
            user.email = email;
            user.mobile = mobile;
            user.address = address;
            await user.save();
            res.status(200).send({
                flag:true,
                message: "Profile updated successfully",
            });

        } catch (error) {
            console.error('Error in edit_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    task_analytics: async (req, res) => {
        try {
            const user = req.user;
            const taskCountByStatus = await Task.findAll({
                attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'taskCount']],
                where: { expert_id:user.id },
                group: ['status']
            });            
            res.status(200).send({
                flag:true,
                message: "Task fetch successfully",
                taskCountByStatus
            });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    today_appointment: async (req, res) => {
        try {
            const user = req.user;
            const todayStart = moment().startOf('day').toDate();
            const todayEnd = moment().endOf('day').toDate();
            const task = await Task.findAll({
                where: {
                    expert_id: user.id,
                    updated_at: {
                        [Op.gte]: todayStart, // Greater than or equal to the start of today
                        [Op.lte]: todayEnd   // Less than or equal to the end of today
                    }
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
    task: async (req, res) => {
        try {
            const user = req.user;
            const task = await Task.findAll({
                where:{expert_id:user.id}
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
    expert_slots: async (req, res) => {
        try {
            const user = req.user;
            const { date, start_time, end_time, is_active } = req.body;
            const newSlot = await Expert_slots.create({
                expert_id:user.id,
                date,
                start_time,
                end_time,
                is_active
            });
            res.status(201).send({flag:true, message: 'Availability slot created successfully', newSlot });
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
    get_expert_slots: async (req, res) => {
        try {
            const user = req.user;
            const newSlot = await Expert_slots.findAll({
                where : {expert_id:user.id}
            });
            res.status(201).send({flag:true, message: 'Availability slot created successfully', newSlot });
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
    add_bank_account: async (req, res) => {
        try {
            const user = req.user;
            const { bank_name, account_holder_name, account_number, ifsc_code } = req.body;
            const newAccount = await Expert_bank_account.create({
                expert_id:user.id,
                bank_name, account_holder_name, account_number, ifsc_code
            });
            res.status(201).send({flag:true, message: 'Bank account added successfully', newAccount });
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
    withdraw_request: async (req, res) => {
        try {
            const user = req.user;
            const { amount } = req.body;
            await Withdraw.create({
                expert_id:user.id,
                amount
            });
            res.status(201).send({flag:true, message: 'withdraw request send successfully' });
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
    withdraw: async (req, res) => {
        try {
            const user = req.user;
            const withdraw_request = await Withdraw.findAll({
                where:{expert_id:user.id}
            });
            res.status(201).send({flag:true, message: 'withdraw request fetch', withdraw_request });
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
    get_bank_account: async (req, res) => {
        try {
            const user = req.user;
            const accounts = await Expert_bank_account.findAll({
                where:{expert_id:user.id}
            });
            res.status(200).send({flag:true, message: 'Bank account fetch successfully', accounts });
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
    delete_bank_account: async (req, res) => {
        try {
            const user = req.user;
            const account = await Expert_bank_account.findOne({
                where:{expert_id:user.id}
            });
            if (account) {
                await account.destroy();
                res.status(200).send({flag:true, message: 'Bank account remove' });
            }else{
                res.status(200).send({flag:false, message: 'Bank account not found' });
            }
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
    user_chat: async (req, res) => {
        try {
            const user = req.user;
            const { uid } = req.query;
            const chat = await Expert_chat.find({"uid":uid,expert_id:user.id});
            res.status(200).send({
                flag:true,
                message: "Chat fetch successfully",
                chat
            });
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
};