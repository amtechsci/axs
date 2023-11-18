const db = require('../../models');
const User = db.User;

module.exports = {
    login: async (req, res) => {
        try {
            res.render('admin/login')
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    }
};