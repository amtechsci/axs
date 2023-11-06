const db = require('../../models');
const User = db.User;
const jwt = require('jsonwebtoken');
const twilio = require('twilio')(process.env.twilioAccountSid, process.env.twilioAuthToken);

const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '30d' });
};

module.exports = {
    login: async (req, res) => {
        try {
            const { mobile } = req.body;
            otp = 111111;
            const [user, created] = await User.findOrCreate({
                where: { mobile },
                defaults: { otp }
            });
            if (!created) {
                await user.update({ otp });
            }
            twilio.messages.create({
                body: 'Your OTP is '+otp,
                from: '+12563644502',
                to: mobile
            })
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
    }
};
