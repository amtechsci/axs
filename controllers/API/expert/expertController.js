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
const Task_status = db.Task_status;
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
            if (req.files && req.files.length > 0) {
                let document_name = "document";
                let i=1;
                await Promise.all(req.files.map(file => {
                    const document_file = file.location;
                    let dn = document_name +" "+i;
                    i++;
                    return Expert_documents.create({ "uid": user.id, "document_name":dn, document_file });
                }));
    
                res.status(200).send({
                    flag: true,
                    message: "Documents updated successfully",
                });
            } else {
                res.status(400).send({ flag: false, message: "No document files provided" });
            }
        } catch (error) {
            console.error('Error in update_document:', error);
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
            const { name, description, gender, category_id } = req.body;
            user.name = name;
            user.description = description;
            user.gender = gender;
            await user.save();
            await Promise.all(category_id.map(cid => 
                Expert_skills.create({ "uid": user.id, "cid": cid })
            ));
            // await Expert_skills.create({"uid":user.id,"cid":category_id,"experience":experience});
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
            let rawTaskStatus = await Task.findAll({
                attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'taskCount']],
                where: { expert_id: user.id },
                group: ['status']
            });
            
            const statusMapping = {
                1: "ongoing",
                2: "complete",
                3: "canceled"
            };
            
            // Convert rawTaskStatus to a more usable format
            let mappedTaskStatus = rawTaskStatus.reduce((acc, item) => {
                acc[statusMapping[item.dataValues.status]] = item.dataValues.taskCount;
                return acc;
            }, {});
            
            // Ensure all statuses are represented
            taskStatus = Object.keys(statusMapping).map(key => ({
                status: statusMapping[key],
                taskCount: mappedTaskStatus[statusMapping[key]] || 0
            }));
                       
            var total = taskStatus[0].taskCount + taskStatus[1].taskCount + taskStatus[2].taskCount;
            let percentage = (taskStatus[1].taskCount/total)*100;
            let formattedPercentage = parseFloat(percentage.toFixed(2));
            const progress = {"total_in_progress":taskStatus[0].taskCount,"percentage":formattedPercentage ? formattedPercentage : 0};
            res.status(200).send({
                flag: true,
                message: "Task analytics fetched successfully",
                taskStatus,
                progress

            });
        } catch (error) {
            console.error('Error in task_analytics:', error);
            res.status(500).send({
                flag: false,
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
            const tasks = await Task.findAll({
                where: { expert_id: user.id }
            });
            for (const task of tasks) {
                const category = await Category.findOne({ where: { id: task.cid } });
                task.dataValues.category = category ? category.dataValues : null;
                if (category && category.parent_id) {
                    const parentCategory = await Category.findOne({ where: { id: category.parent_id } });
                    task.dataValues.parentCategory = parentCategory ? parentCategory.dataValues : null;
                } else {
                    task.dataValues.parentCategory = null;
                }
            }
            res.status(200).send({ flag: true, message: "Task fetched successfully", task: tasks });
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({ flag: false, message: 'Internal Server Error ' + error.message });
        }
    },    
    update_task: async (req, res) => {
        try {
            const user = req.user;
            const { tid,status } = req.query;
            const task = await Task.findOne({ where: { id: tid } });
            if (!task) {
                return res.status(404).send({ flag: false, message: "Task not found" });
            }
            task.status = status;
            task.save();
            let statusmess = status == 1 ? 'Task in progress' : (status == 2 ? 'Complete' : 'Cancel');
            Task_status.create({"task_id":tid,status:statusmess});
            res.status(200).send({ flag: true, message: "Task Status updated"});
        } catch (error) {
            console.error('Error in task_details:', error);
            res.status(500).send({ flag: false, message: 'Internal Server Error ' + error.message });
        }
    },   
    task_details: async (req, res) => {
        try {
            const user = req.user;
            const { tid } = req.query;
            const task = await Task.findOne({ where: { id: tid } });
            if (!task) {
                return res.status(404).send({ flag: false, message: "Task not found" });
            }
    
            // Fetch customer details
            let customer;
            if (task.type == "ticket") {
                customer = await Executive.findOne({ where: { id: task.uid } });
            } else {
                customer = await User.findOne({ where: { id: task.uid } });
            }

            const category = await Category.findOne({ where: { id: task.cid } });
            let parentCategory = null;
            if (category && category.parent_id) {
                parentCategory = await Category.findOne({ where: { id: category.parent_id } });
            }
            const task_status = await Task_status.findAll({
                attributes: ['status', 'created_at'],
                where: { task_id: task.id }
            });

            const response = {
                ...task.dataValues,
                category_name: category ? category.category_name : null,
                category_img: category ? category.category_img : null,
                parent_category: parentCategory ? parentCategory.dataValues : null,
                customer: customer ? customer.dataValues : null,
                task_status: task_status || []
            };
    
            res.status(200).send({ flag: true, message: "Task fetched successfully", task: response });
        } catch (error) {
            console.error('Error in task_details:', error);
            res.status(500).send({ flag: false, message: 'Internal Server Error ' + error.message });
        }
    },
    
    expert_slots: async (req, res) => {
        try {
            const user = req.user;
            const datesWithSlots = req.body; // Expecting an array of objects
            let createdSlots = [];
            for (const dateSlot of datesWithSlots) {
                const { date, slots, isAvailable = true } = dateSlot; // Default isAvailable to true
                for (const slot of slots) {
                    const { start_time, end_time } = slot;
                    // If isAvailable is false, override is_active to false
                    const is_active = isAvailable ? slot.is_active : false;
                    const newSlot = await Expert_slots.create({
                        expert_id: user.id,
                        date,
                        start_time,
                        end_time,
                        is_active
                    });
                    createdSlots.push(newSlot);
                }
            }
            res.status(200).send({ flag: true, message: 'Availability slots created successfully', createdSlots });
        } catch (error) {
            console.error('Error in creating availability slots:', error);
            res.status(500).send({ flag: false, message: 'Internal Server Error' });
        }
    },
    
    get_expert_slots: async (req, res) => {
        try {
            const user = req.user;
            const newSlot = await Expert_slots.findAll({
                where : {expert_id:user.id}
            });
            res.status(200).send({flag:true, message: 'Availability slot created successfully', newSlot });
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
            res.status(200).send({flag:true, message: 'Bank account added successfully', newAccount });
        } catch (error) {
            console.error('Error in creating availability slot:', error);
            res.status(500).send({flag:false, message: 'Internal Server Error' });
        }
    },
    withdraw_request: async (req, res) => {
        try {
            const user = req.user;
            const { amount } = req.body;
            if(user.wallet >= amount){
                await Withdraw.create({
                    expert_id:user.id,
                    amount
                });
                res.status(200).send({flag:true, message: 'withdraw request send successfully' });
            }else{
                res.status(200).send({flag:true, message: 'you do not have sufficient balance to withdraw'});
            }
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
            res.status(200).send({flag:true, message: 'withdraw request fetch', withdraw_request });
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