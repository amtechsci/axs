const db = require('../../../models');
const User = db.User;
const Preference = db.Preference;
const Get_subscription = db.Get_subscription;
const User_subscription = db.User_subscription;
const { uploadFile } = require('../../../config/aws-bucket');


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
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            const { name, email, gender } = req.body;
            user.name = name;
            user.email = email;
            user.gender = gender;
            await user.save();
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
    update_profile_image: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            if (req.file) {
                const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                const mimeType = req.file.mimetype;
                if (!allowedTypes.includes(mimeType)) {
                    res.status(400).send({flag: false, message: "Unsupported file type" });
                    return;
                }
                const key = `profile_images/${userId}/${req.file.originalname}`;
            
                uploadFile(req.file.path, key, mimeType)
                  .then(data => {
                    user.profile_img = data.Location;
                    return user.save();
                  })
                  .then(() => {
                    res.status(200).send({
                      flag: true,
                      message: "Profile image updated successfully",
                    });
                  })
                  .catch(error => {
                    console.error('Error in file upload:', error);
                    res.status(500).send({
                      flag: false,
                      message: 'Error uploading file'
                    });
                  });
              } else {
                res.status(400).send({ flag: false, message: "No image file provided" });
            }
        } catch (error) {
            console.error('Error in update_profile_image:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error ' + error
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
                flag:true,
                message: "Preferences updated successfully",
            });

        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                    flag:true,
                    message: "User data successfully",
                    user
                });
            }
        } catch (error) {
            console.error('Error in setup_profile:', error);
            res.status(500).send({
                flag:false,
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
                flag:true,
                message: "Subscription fetch successfully",
                user_subscription
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
