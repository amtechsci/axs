const db = require('../../models');
const User = db.User;
const Permissions = db.Permissions;
const Roles = db.Roles;
const Executive = db.Executive;
const Category = db.Category;
const Get_subscription = db.Get_subscription;

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
    },
    index: async (req, res) => {
        try {
            res.render('admin/index')
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
    user_roles: async (req, res) => {
        try {
            const permissions = await Permissions.findAll();
            const roles = await Roles.findAll();
            res.render('admin/user_roles',{permissions,roles})
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
    set_roles: async (req, res) => {
        try {
            const permissions = await Permissions.findAll();
            const roles = await Roles.findAll();
            res.render('admin/user_roles',{permissions,roles})
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
    customers: async (req, res) => {
        try {
            const users = await User.findAll({where:{user_type:1}});
            res.render('admin/customers',{users})
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
    experts: async (req, res) => {
        try {
            const users = await User.findAll({where:{user_type:2}});
            res.render('admin/experts',{users})
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
    employees: async (req, res) => {
        try {
            const executive = await Executive.findAll({where:{user_role:2}});
            res.render('admin/employees',{executive})
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
    partners: async (req, res) => {
        try {
            const executive = await Executive.findAll({where:{user_role:3}});
            res.render('admin/partners',{executive})
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
    categories: async (req, res) => {
        try {
            const categories = await Category.findAll({ where: { "category_type": 1 } });
            function findSubCategories(mainCategoryId) {
                return categories.filter(category => category.parent_id === mainCategoryId);
            }
            const mainCategories = categories
                .filter(category => category.parent_id === 0)
                .map(mainCategory => ({
                    category_name: mainCategory.category_name,
                    category_img: mainCategory.category_img,
                    parent_id: mainCategory.parent_id,
                    category_type: mainCategory.category_type,
                    created_at: mainCategory.created_at,
                    sub_category: findSubCategories(mainCategory.id).map(sub => ({
                        category_name: sub.category_name,
                        category_img: sub.category_img,
                        parent_id: sub.parent_id,
                        category_type: sub.category_type,
                        created_at: mainCategory.created_at,
                    }))
                }));
                
            res.render('admin/categories', { category: mainCategories });
        } catch (error) {
            console.error('Error in fetching categories:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error' + error
            });
        }
    },
    expert_categories: async (req, res) => {
        try {
            const categories = await Category.findAll({ where: { "category_type": 2 } });
            function findSubCategories(mainCategoryId) {
                return categories.filter(category => category.parent_id === mainCategoryId);
            }
            const mainCategories = categories
                .filter(category => category.parent_id === 0)
                .map(mainCategory => ({
                    category_name: mainCategory.category_name,
                    category_img: mainCategory.category_img,
                    parent_id: mainCategory.parent_id,
                    category_type: mainCategory.category_type,
                    created_at: mainCategory.created_at,
                    sub_category: findSubCategories(mainCategory.id).map(sub => ({
                        category_name: sub.category_name,
                        category_img: sub.category_img,
                        parent_id: sub.parent_id,
                        category_type: sub.category_type,
                        created_at: mainCategory.created_at,
                    }))
                }));
                
            res.render('admin/categories', { category: mainCategories });
        } catch (error) {
            console.error('Error in fetching categories:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error' + error
            });
        }
    },
    subscriptions: async (req, res) => {
        try {
            const get_subscription = await Get_subscription.findAll();
            res.render('admin/subscriptions',{get_subscription})
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
};