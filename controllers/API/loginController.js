const db = require('../../models');
const User = db.User;
const Expert = db.Expert;
const jwt = require('jsonwebtoken');
const twilio = require('twilio')(process.env.twilioAccountSid, process.env.twilioAuthToken);

const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '30d' });
};

module.exports = {
    login: async (req, res) => {
        try {
            const { mobile,user_type } = req.body;
            otp = 1111;
            let mess,userdata;
                const [user, created] = await User.findOrCreate({
                    where: { mobile,user_type },
                    defaults: { otp }
                });
                if (!created) {
                    await user.update({ otp });
                }
                mess = created ? user_type+' created and OTP sent' : 'OTP sent';
                userdata = user;
            twilio.messages.create({
                body: 'Your OTP is '+otp,
                from: '+12563644502',
                to: mobile
            })
            res.json({
                message: mess,
                user: {
                    id: userdata.id,
                    mobile: userdata.mobile
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
            const { mobile, otp, device_token, device_id, user_type} = req.body;
            let where = {where: { mobile, otp, user_type }}
            let user = await User.findOne(where);
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
    forgot_pin: async (req, res) => {
        try {
            const { mobile,user_type } = req.body;
            otp = 1111;
            const user = await User.findOne({
                    where: { mobile,user_type }
                });
            if (user) {
                await user.update({ otp });
            }else{
                res.status(404).send({
                    message: 'User not found'
                });
            }
            twilio.messages.create({
                body: 'Your OTP is '+otp,
                from: '+12563644502',
                to: mobile
            })
            res.json({
                message: 'OTP sent',
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
    forgot_pin_otp: async (req, res) => {
        try {
            const { mobile, otp, device_token, device_id, user_type} = req.body;
            let where = {where: { mobile, otp }}
            const user = await User.findOne(where);
            if (user) {
                const token = generateToken(user);
                await user.update({ device_token : device_token , device_id:device_id });
                let new_user = 1;
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
