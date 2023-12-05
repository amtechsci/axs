const db = require('../../models');
const User = db.User;
const Permissions = db.Permissions;
const Roles = db.Roles;
const Executive = db.Executive;
const Category = db.Category;
const Get_subscription = db.Get_subscription;
const Experience = db.Experience;

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
                    id: mainCategory.id,
                    category_name: mainCategory.category_name,
                    category_img: mainCategory.category_img,
                    parent_id: mainCategory.parent_id,
                    category_type: mainCategory.category_type,
                    created_at: mainCategory.created_at,
                    sub_category: findSubCategories(mainCategory.id).map(sub => ({
                        id: sub.id,
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
                
            res.render('admin/expert_categories', { category: mainCategories });
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
    add_user: async (req, res) => {
        try {
            const {modal,name,profile_img,user_type,mobile,email,pin,gender} = req.body;
            if(modal == 'user'){
                await User.create({name,profile_img,user_type,mobile,email,pin,gender});
                if(user_type == 1){
                    res.redirect('/admin/customers');
                }else{
                    res.redirect('/admin/experts');
                }
            }else{
                let user_role = user_type;
                await Executive.create({name,profile_img,user_role,mobile,email,pin,gender});
                if(user_type == 3){
                    res.redirect('/admin/partners');
                }else{
                    res.redirect('/admin/employees');
                }
            }
        } catch (error) {
            console.error('Error in update_profile_image:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error ' + error
            });
        }
    },
    file_upload: async (req, res) => {
        try {
            if (req.file) {
                res.status(200).send({
                    file_url:req.file.location
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
    files_upload: async (req, res) => {
        try {
            if (req.files && req.files.length > 0) {
                let document_url = [];
                document_url = await Promise.all(req.files.map(file => {
                    return file.location;
                }));
                res.status(200).send({document_url});
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
    experiences: async (req, res) => {
        try {
            const categories = await Category.findAll({ where: { "category_type": 1 , "parent_id":0} });
            const experience = await Experience.findAll();
            // res.status(200).send(mainCategories);
            res.render('admin/experiences',{experience,categories})
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).send({
                flag:false,
                message: 'Internal Server Error'+error
            });
        }
    },
    getsubcat: async (req, res) => {
        try {
            const categories = await Category.findAll({ where: { "parent_id": req.query.cid } });
    
            if (categories.length === 0) {
                // No subcategories found
                res.status(200).send('<option value="">No subcategories</option>');
            } else {
                // Subcategories found, build the options HTML
                let html = '';
                categories.forEach(function(category) {
                    html += '<option value="' + category.id + '">' + category.category_name + '</option>';
                });
                res.status(200).send(html);
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    add_experience: async (req, res) => {
        try {
            const {
                edit_id = 0, type, title, images, user_role, modal, description,
                cid, scid, price, location, from, to, start_time, end_time, things_to_do
            } = req.body;
            let imagess = JSON.parse(images)
            const thingsToDoString = things_to_do.join(',');
            const imagesString = imagess.join(',');
            // const imagesString = JSON.stringify(images);
            if(edit_id != 0){
                const experienceToUpdate = await Experience.findByPk(edit_id);
                if (!experienceToUpdate) {
                    if(type == "experience"){
                        const newExperience = await Experience.create({
                            type, title, images: imagesString, user_role,
                            modal, description, cid, scid, price, location,
                            from, to, things_to_do: thingsToDoString
                        });
                    }else{
                        const newExperience = await Experience.create({
                            type, title, images: imagesString, user_role,
                            modal, description, cid, scid, price, location,
                            from, to, things_to_do: thingsToDoString, start_time, end_time
                        });
                    }
                }
                const updatedExperience = await experienceToUpdate.update({
                    type, title, images: imagesString, user_role,
                    modal, description, cid, scid, price, location,
                    from, to, things_to_do: thingsToDoString
                });
            }else{
                const newExperience = await Experience.create({
                    type, title, images: imagesString, user_role,
                    modal, description, cid, scid, price, location,
                    from, to, things_to_do: thingsToDoString
                });
            }
            res.redirect('/admin/experiences');
        } catch (error) {
            console.error('Error in add_experience:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error ' + error
            });
        }
    },
    deleteExperience: async (req, res) => {
        try {
            const experienceId = req.query.experienceId; // Assuming the ID is passed as a URL parameter
            const experienceToDelete = await Experience.findByPk(experienceId);
    
            if (!experienceToDelete) {
                return res.status(404).send({
                    flag: false,
                    message: 'Experience not found'
                });
            }
    
            // Delete the experience
            await experienceToDelete.destroy();
    
            res.redirect('/admin/experiences');
    
        } catch (error) {
            console.error('Error in deleteExperience:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error ' + error
            });
        }
    },     
    add_category: async (req, res) => {
        try {
            // Extract data from request
            const { category_name, category_description, category_img, sub_category, category_type } = req.body;
        
            // Create main category
            const mainCategory = await Category.create({
              category_name,
              category_description,
              category_img,
              parent_id: null, // null for main category
              category_type // Assuming 1 represents 'category'
            });
        
            // Create subcategories if they exist
            if (sub_category && sub_category.length > 0) {
              for (const sub of sub_category) {
                await Category.create({
                  category_name: sub["'name'"],
                  category_description: sub["'description'"],
                  category_img: sub["'img'"],
                  parent_id: mainCategory.id, // set parent_id to main category's id
                  category_type // Assuming 2 represents 'Expert category'
                });
              }
            }
            if(req.body.category_type == 1){
                res.redirect('/admin/categories');
            }else{
                res.redirect('/admin/expert-categories');
            }
          } catch (error) {
            console.error('Error adding category:', error);
            res.status(500).send({ message: 'Error adding category' });
          }
    },
    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const experienceToDelete = await Category.findByPk(categoryId);
    
            if (!experienceToDelete) {
                return res.status(404).send({
                    flag: false,
                    message: 'Experience not found'
                });
            }
            // Delete the experience
            category_type = experienceToDelete.category_type;
            await experienceToDelete.destroy();
            if(req.body.edit_category_type == 1){
                res.redirect('/admin/categories');
            }else{
                res.redirect('/admin/expert-categories');
            }    
        } catch (error) {
            console.error('Error in deleteExperience:', error);
            res.status(500).send({
                flag: false,
                message: 'Internal Server Error ' + error
            });
        }
    },  
    get_category: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const experienceToDelete = await Category.findByPk(categoryId);
            if (!experienceToDelete) {
                return res.status(404).send({
                    flag: false,
                    message: 'Experience not found'
                });
            }
            res.json(experienceToDelete);
          } catch (error) {
            console.error('Error fetching category data:', error);
            res.status(500).send('Server error');
          }
    }, 
    edit_category: async (req, res) => {
        try {
            const categoryId = req.body.edit_id;
            await Category.update({
                category_name: req.body.edit_category_name,
                category_img: req.body.edit_category_img,
                category_description: req.body.category_description,
            }, {
                where: { id: categoryId }
            });
            if(req.body.edit_category_type == 1){
                res.redirect('/admin/categories');
            }else{
                res.redirect('/admin/expert-categories');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).send('Internal Server Error');
        }
    }  
};