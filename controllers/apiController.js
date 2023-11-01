const db = require('../models');
const User = db.User;
const Notification = require('../models/mongo/notification');
const Category = db.Category;
const Preference = db.Preference;
const Get_subscription = db.Get_subscription;
const User_subscription = db.User_subscription;
const Experience = db.Experience;
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '30d' });
};

module.exports = {
    login: async (req, res) => {
        try {
            const { mobile } = req.body;
            const [user, created] = await User.findOrCreate({
                where: { mobile },
                defaults: { otp: 111111 }
            });
            if (!created) {
                await user.update({ otp: 111111 });
            }
            res.json({
                message: created ? 'User created and OTP sent' : 'OTP sent',
                user: {
                    id: user.id,
                    mobile: user.mobile
                }
            });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                message: 'Internal Server Error'+error
            });
        }
    },
    otp: async (req, res) => {
        try {
            const { mobile, otp, device_token, device_id } = req.body;
            const user = await User.findOne({
                where: { mobile, otp }
            });
            if (user) {
                const token = generateToken(user);
                await user.update({ device_token : device_token , device_id:device_id });
                let new_user = user.name ? 0 : 1;
                res.json({
                    message: 'Login success',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        gender: user.gender,
                        profile_img: user.profile_img,
                        new_user
                    },
                    token
                });
            } else {
                res.status(404).send({
                    message: 'User not found or OTP incorrect'
                });
            }
        } catch (error) {
            console.error('Error in OTP verification:', error);
            res.status(500).send({
                message: 'Internal Server Error: ' + error.message
            });
        }
    },
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
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    setup_profile: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const { name, email, gender } = req.body;
            user.name = name;
            user.email = email;
            user.gender = gender;
            await user.save();
            res.status(200).send({
                message: "Profile updated successfully",
                user: {
                    id: user.id,
                    mobile: user.mobile,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
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
    add_preferences: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const { cid } = req.body;
            const catIds = cid.split(',').map(cat_id => ({ uid: user.id, cid: Number(cat_id) }));
            await Preference.bulkCreate(catIds);
            res.status(200).send({
                message: "Preferences updated successfully",
            });

        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    update_profile_image: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            if (req.file && req.file.path) {
                console.log(req.file);
                user.profile_img = req.file.path;
                await user.save();
                res.status(200).send({
                    message: "Profile image updated successfully",
                    user: {
                        id: user.id,
                        mobile: user.mobile,
                        name: user.name,
                        email: user.email,
                        profile_img: user.profile_img
                    }
                });
            } else {
                res.status(400).send({ message: "No image file provided" });
            }
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                message: 'Internal Server Error ' + error.message
            });
        }
    },
    get_user: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }else{
                res.status(200).send({
                    message: "User data successfully",
                    data : {user}
                });
            }
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
    user_current_subscription: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const user_subscription = await User_subscription.findOne({
                where: {
                    uid: userId,
                    status: 1
                },
                include: [{
                    model: Get_subscription,
                    as: 'get_subscription',
                    attributes: ['plan_name', 'plan_description', 'plan_type'],
                }],
                attributes: ['validity_till', 'status', 'created_at', 'updated_at']
            });            
            res.status(200).send({
                message: "Subscription fetch successfully",
                user_subscription
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
};
