const configDotenv = require("dotenv").configDotenv;
const { Materials, Purchases, Sells, User, Visitor } = require("./libs/models.js");
const express = require("express");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { storage } = require("./utils/utils.js");
const { unlinkSync, existsSync } = require("fs");
const circularJSON = require('circular-json');

configDotenv()
const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));


app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/api/sells/all/:id/:asAdmin', async (req, res) => {
    try {
        const sells = await Sells.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'fullname', 'email', 'avatar']
                },
                {
                    model: Materials,
                    // as: 'material',
                    attributes: ['name'],
                },
            ],
            where: req.params.asAdmin === 'true' || req.params.asAdmin === true ? {} : {
                user_id: req.params.id
            },
            order: [['id', 'DESC']],
            limit: 30,
            attributes: ['id', 'sellingPrice', 'quantity', 'createdAt']
        });
        // const materials = await Materials.findAll({
        //     include: {
        //         model: Materials, // Include child materials
        //         as: 'children',
        //         where: { parent_id: Sequelize.col('Materials.id') }, // Self-join condition
        //         include: [ // Recursive include for grandchild materials (optional)
        //             { model: Materials, as: 'children', attributes: ['id', 'name'] }, // Only fetch ID and name for grandchildren
        //         ],
        //     },

        //     where: { parentId: null },
        //     attributes: ['id', 'name'],
        // });
        const [parentMaterials, materialsWithChildren] = await Promise.all([
            Materials.findAll({
                where: { parentId: null },
                ttributes: ['name', 'id']
            }), // Get parent materials
            Materials.findAll({ // Get materials with children
                include: {
                    model: Materials,
                    as: 'children',
                    where: { parent_id: Sequelize.col('Materials.id') },
                    include: [
                        { model: Materials, as: 'children', attributes: ['id', 'name'] },
                    ],
                    attributes: ['id', 'name']
                },
                where: { parentId: null }
                , attributes: ['id', 'name']
            }),
        ]);
        // const materials = [...new Set(parentMaterials.map(m => m.id))].map(id => parentMaterials.find(m => m.id === id));
        const allMaterials = parentMaterials.reduce((acc, parentMaterial) => {
            const existingMaterial = materialsWithChildren.find(m => m.id === parentMaterial.id);
            if (existingMaterial) {
                acc.push({ ...parentMaterial.toJSON(), ...existingMaterial.toJSON() }); // Combine properties
            } else {
                acc.push(parentMaterial.toJSON());
            }
            return acc;
        }, []);
        // res.json({ sells, materials: allMaterials });
        res.send({ sells, materials: circularJSON.stringify(allMaterials) })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});


app.delete('/api/materials/:id/delete', async (req, res) => {
    try {
        const materialId = req.params.id;
        console.log('() => ', req.params)
        const deletedMaterial = await Materials.destroy({
            where: { id: materialId },
        });
        if (deletedMaterial === 0) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting material' });
    }
});

app.post('/api/materials/new', async (req, res) => {
    try {
        const { name, description, price, quantity, user_id, parent_id, id } = req.body;
        if (id) {
            const existingMaterial = await Materials.findByPk(id);
            if (!existingMaterial) {
                return res.status(404).json({ message: 'Material not found' });
            }
            await existingMaterial.update({
                name,
                description,
                quantity,
                price: Number(price),
                user_id,
                parentId: parent_id,
            });
            res.json({ message: 'Material updated successfully', material: existingMaterial });
        } else {
            const newMaterial = await Materials.create({
                user_id,
                name,
                description,
                quantity,
                price: Number(price),
                parentId: parent_id,
            });
            res.json({ message: 'Material added successfully', material: newMaterial });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding material' });
    }
});

app.get('/api/materials/all/:id/:asAdmin', async (req, res) => {
    console.log('() => ', req.params)
    try {
        const all = await Materials.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'fullname', 'email', 'avatar']
                },
                {
                    model: Materials,
                    as: 'parent',
                    attributes: ['name'],
                },
            ],
            where: req.params.asAdmin === 'true' || req.params.asAdmin === true ? {} : {
                user_id: req.params.id
            },
            order: [['id', 'DESC']],
            limit: 30,
            attributes: ['name', 'id', 'description', 'price', 'quantity', 'createdAt']
        });
        res.json(all);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.post('/api/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ],
            },
            attributes: ['id', 'address', 'asAdmin', 'avatar', 'createdAt', 'email', 'fullname', 'purchases', 'sellings', 'username']
        });
        if (!user) return res.status(401).json({ message: 'Invalid username/email or password' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }
        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.get('/api/users/:id/delete', async (req, res) => {
    const userId = req.params.id;
    try {
        const userToDelete = await User.findByPk(userId);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.destroy({
            where: { id: userId },
            cascade: true,
        });
        if (userToDelete.avatar != '') {
            let p = process.env.BASE_FOLDER + userToDelete.avatar;
            if (userToDelete.avatar && existsSync(p)) {
                unlinkSync(p)
            }
        }
        res.json({ message: 'User and related records deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

app.get('/api/users/topBySellings', async (req, res) => {
    try {
        // const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
        // const last28Days = new Date(Date.now() - oneDay * 28);

        const topUsersBySellings = await User.findAll({
            // updatedAt: {
            //     [Op.gte]: last28Days, // Greater than or equal to 28 days ago
            // },
            order: [['sellings', 'DESC']],
            attributes: ['id', 'sellings', 'username', 'email', 'fullname', 'avatar'],
            limit: 10, // Fetch specified number of top users
        });
        res.json(topUsersBySellings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get top users by Purchases
app.get('/api/users/topByPurchases', async (req, res) => {
    try {
        const topUsersByPurchases = await User.findAll({
            order: [['purchases', 'DESC']],
            attributes: ['id', 'purchases', 'username', 'email', 'fullname', 'avatar'],
            limit: 10,
        });
        res.json(topUsersByPurchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/api/users/all', async (req, res) => {
    try {
        const allUsers = await User.findAll({
            order: [['id', 'DESC']], // Assuming 'id' is the primary key
            limit: 30,
            attributes: ['id', 'username', 'fullname', 'email', 'avatar', 'address', 'sellings', 'purchases', 'createdAt', 'updatedAt'],
        });
        res.json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

const upload = multer({ storage: storage })
app.post('/api/new-user', upload.single('avatar'), async (req, res) => {
    const { asAdmin, username, fullname, email, address, password, update, old_username, old_email, id } = req.body;
    const avatarFile = req.file ? process.env.RELATIVE_IMAGE_FILE_PATH + req.file.filename : '';
    let validate = null;
    if (username !== old_username) {
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) validate = "Username is already exist please choose another one."
    }
    if (email !== old_email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) validate = 'Email already exists';
    }
    if (validate) {
        if (avatarFile != '')
            unlinkSync(process.env.BASE_FOLDER + process.env.RELATIVE_IMAGE_FILE_PATH + req.file.filename)
        return res.status(400).json({ message: validate });
    };
    try {
        if (!update) {
            const newUser = await User.create({
                username,
                fullname,
                email,
                avatar: avatarFile,
                address,
                password,
                asAdmin
            });
            res.status(201).json({ message: 'User created successfully', user: newUser });
        } else {
            const userToUpdate = await User.findByPk(id);
            if (!userToUpdate) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (req.body.password) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                userToUpdate.password = hashedPassword;
            }
            userToUpdate.username = username;
            userToUpdate.fullname = fullname;
            userToUpdate.email = email;
            userToUpdate.address = address;
            userToUpdate.asAdmin = asAdmin
            if (avatarFile && avatarFile != '' && userToUpdate.avatar != '') {
                unlinkSync(process.env.BASE_FOLDER + userToUpdate.avatar)
                userToUpdate.avatar = avatarFile
            }
            await userToUpdate.save();
            res.json({ message: 'User updated successfully' });
        }
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'An error occurred while saving user' });
    }
})

app.get('/count/visitors', async (req, res) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30)
    const visitors = await Visitor.findAll({
        where: {
            createdAt: {
                [Sequelize.Op.gte]: thresholdDate
            }
        },
        attributes: ['createdAt', 'totalVisits'],
        order: [['createdAt', 'ASC']]
    });
    res.send(visitors)
})
app.get('/count/purchases', async (req, res) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);
    const sells = await Purchases.findAll({
        where: {
            createdAt: {
                [Sequelize.Op.gte]: thresholdDate
            }
        },
        attributes: ['createdAt', 'purchasePrice'],
        order: [['createdAt', 'DESC']]
    });
    res.send(sells)
})
app.get('/count/sells', async (req, res) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 365);
    const sells = await Sells.findAll({
        where: {
            createdAt: {
                [Sequelize.Op.gte]: thresholdDate
            }
        },
        attributes: ['createdAt', 'sellingPrice'],
        order: [['createdAt', 'DESC']]
    });
    res.send(sells)
})
app.get('/count/user', async (req, res) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 772);
    const users = await User.findAll({
        where: {
            createdAt: {
                [Sequelize.Op.gte]: thresholdDate
            }
        },
        attributes: ['createdAt'],
        order: [['createdAt', 'DESC']]
    });
    res.send(users)
})


app.listen(process.env.PORT, () => console.log(`Listening on port http://127.0.0.1:${process.env.PORT}`))
// Create a new user
// const newUser = await User.create({ name: 'John Doe', email: 'john.doe@example.com' });

// // Find all users
// const users = await User.findAll();

// // Find a user by ID
// const user = await User.findByPk(1);

// // Update a user
// user.email = 'updated@email.com';
// await user.save();

// // Delete a user
// await user.destroy();
