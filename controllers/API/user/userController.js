const db = require('../../../models');
const User = db.User;
const Preference = db.Preference;
const Get_subscription = db.Get_subscription;
const User_subscription = db.User_subscription;

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
};
