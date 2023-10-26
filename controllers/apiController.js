const db = require('../models');
const User = db.User;
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
                defaults: { otp: 1111 }
            });
            if (!created) {
                await user.update({ otp: 1111 });
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
            const token = generateToken(user);
            if (user) {
                await user.update({ device_token : device_token , device_id:device_id });
                res.json({
                    message: 'Login success',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        gender: user.gender,
                        profile_img: user.profile_img
                    },
                    token
                });
            } else {
                // Handle the case where the user is not found
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
    
};
