const configDotenv = require("dotenv").configDotenv;
const { materials, Purchases, Sells, User, Visitor } = require("./libs/models.js");
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
    origin: 'https://admin.alzainmhc.com'
}));

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/api/search/materials', async (req, res) => {
    const { query } = req.query;
    try {
        const materials = await materials.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { id: query },
                    { name: query },
                ],
            },
            attributes: ['id', 'name', 'createdAt', 'price', 'quantity'],
        });
        res.json(materials);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching materials' });
    }
});

app.post('/api/purchases/new', async (req, res) => {
    try {
        const { userId, purchasePrice, quantity, MaterialId, id, editMode } = req.body;
        if (!userId || !purchasePrice || !quantity || !MaterialId) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        if (id && editMode) {
            const exist = await Purchases.findByPk(id);
            if (!exist) {
                return res.status(404).json({ message: 'Purchase record not found' });
            }
            let mat = await materials.findByPk(MaterialId)
            let matC = mat.totalPurchases - exist.quantity
            matC += quantity
            await mat.update({
                totalPurchases: matC
            })
            // update users to price 
            let usr = await User.findByPk(userId)
            let usrC = usr.purchases - Number(exist.purchasePrice)
            usrC += Number(purchasePrice)
            await usr.update({
                purchases: usrC
            })
            await exist.update({
                purchasePrice: Number(purchasePrice),
                quantity,
                MaterialId
            });
            res.json({ message: 'Purchase record updated successfully', material: exist });
        } else {
            const sell = await Purchases.create({
                userId,
                purchasePrice,
                quantity,
                MaterialId,
            });
            let mat = await materials.findByPk(MaterialId)
            let matC = mat.totalPurchases + quantity
            await mat.update({
                totalPurchases: matC
            })
            // update users to price 
            let usr = await User.findByPk(userId)
            let usrC = usr.purchases + purchasePrice
            await usr.update({
                purchases: usrC
            })
            res.status(201).json(sell);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving sell' });
    }
});
app.delete('/api/purchases/:id/delete', async (req, res) => {
    try {
        const _id = req.params.id;
        const deleted = await Purchases.destroy({
            where: { id: _id },
        });
        if (deleted === 0) {
            return res.status(404).json({ message: 'Purchase record not found' });
        }
        res.json({ message: 'Purchase record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting purchase' });
    }
});
app.post('/api/sells/new', async (req, res) => {
    try {
        const { userId, sellingPrice, quantity, MaterialId, id, editMode } = req.body;
        if (!userId || !sellingPrice || !quantity || !MaterialId) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        if (id && editMode) {
            const exist = await Sells.findByPk(id);
            if (!exist) {
                return res.status(404).json({ message: 'Sell record not found' });
            }

            let mat = await materials.findByPk(MaterialId)
            let matC = mat.totalSells - exist.quantity
            matC += quantity
            await mat.update({
                totalSells: matC
            })
            // user 
            let usr = await User.findByPk(userId)
            let exs = Number(exist.sellingPrice)
            let usrC = usr.sellings - exs
            usrC += Number(sellingPrice)
            await usr.update({
                sellings: usrC
            })
            await exist.update({
                sellingPrice: Number(sellingPrice),
                quantity,
                MaterialId
            });
            res.json({ message: 'Sell record updated successfully', material: exist });
        } else {

            const sell = await Sells.create({
                userId,
                sellingPrice: Number(sellingPrice),
                quantity,
                MaterialId,
            });
            let usr = await User.findByPk(userId)
            let usrC = usr.sellings + Number(sellingPrice)
            await usr.update({
                sellings: usrC
            })
            let mat = await materials.findByPk(MaterialId)
            let matC = mat.totalSells + quantity
            await mat.update({
                totalSells: matC
            })
            res.status(201).json(sell);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving sell' });
    }
});

const getmaterials = async (query) => {
    let pm = {
        parentId: null
    }
    let mc = {
        parent_id: Sequelize.col('materials.id')
    }
    if (query.asAdmin === 'false' || query.asAdmin === false) {
        pm.user_id = query.id
        mc.user_id = query.id
    }
    const [parentmaterials, materialsWithChildren] = await Promise.all([
        materials.findAll({
            where: pm,
            ttributes: ['name', 'id']
        }),
        materials.findAll({
            include: {
                model: materials,
                as: 'children',
                where: mc,
                include: [
                    { model: materials, where: mc, as: 'children', attributes: ['id', 'name'] },
                ],
                attributes: ['id', 'name']
            },
            where: pm,
            attributes: ['id', 'name']
        }),
    ]);
    const allmaterials = parentmaterials.reduce((acc, parentMaterial) => {
        const existingMaterial = materialsWithChildren.find(m => m.id === parentMaterial.id);
        if (existingMaterial) {
            acc.push({ ...parentMaterial.toJSON(), ...existingMaterial.toJSON() }); // Combine properties
        } else {
            acc.push(parentMaterial.toJSON());
        }
        return acc;
    }, []);
    return allmaterials
}

app.get('/api/purchases/all/:id/:asAdmin', async (req, res) => {
    try {
        const items = await Purchases.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'fullname', 'email', 'avatar']
                },
                {
                    model: materials,
                    attributes: ['name'],
                },
            ],
            where: req.params.asAdmin === 'true' || req.params.asAdmin === true ? {} : {
                userId: req.params.id
            },
            order: [['id', 'DESC']],
            limit: 30,
        });
        res.send({ items, materials: circularJSON.stringify(await getmaterials(req.params)) })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/api/sells/all/:id/:asAdmin', async (req, res) => {
    try {
        const sells = await Sells.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'fullname', 'email', 'avatar']
                },
                {
                    model: materials,
                    attributes: ['name'],
                    as: 'material'
                },
            ],
            where: req.params.asAdmin === 'true' || req.params.asAdmin === true ? {} : {
                userId: req.params.id
            },
            order: [['id', 'DESC']],
            limit: 30,
        });
        res.send({ sells, materials: circularJSON.stringify(await getmaterials(req.params)) })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Sells', error: error });
    }
});
app.delete('/api/sells/:id/delete', async (req, res) => {
    try {
        const sellId = req.params.id;
        const deletedSells = await Sells.destroy({
            where: { id: sellId },
        });
        if (deletedSells === 0) {
            return res.status(404).json({ message: 'Sell record  not found' });
        }
        res.json({ message: 'Sell record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting sell' });
    }
});
app.delete('/api/materials/:id/delete', async (req, res) => {
    try {
        const materialId = req.params.id;
        console.log('() => ', req.params)
        const deletedMaterial = await materials.destroy({
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
            const existingMaterial = await materials.findByPk(id);
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
            const newMaterial = await materials.create({
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
    try {
        const all = await materials.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'fullname', 'email', 'avatar']
                },
                {
                    model: materials,
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
        });
        if (!user) return res.status(401).json({ message: 'Invalid username/email or password' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }
        delete user.password;
        res.json({ message: 'Login successful', user: { id: user.id, asAdmin: user.asAdmin, avatar: user.avatar, username: user.username, fullname: user.fullname, email: user.email } });
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
            let p = '/home/alzainmh/admin.alzainmhc.com' + userToDelete.avatar;
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
            attributes: ['id', 'asAdmin', 'username', 'fullname', 'email', 'avatar', 'address', 'sellings', 'purchases', 'createdAt', 'updatedAt'],
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
    const avatarFile = req.file ? '/media/images/' + req.file.filename : '';
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
            unlinkSync('/home/alzainmh/admin.alzainmhc.com/media/images/' + req.file.filename)
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

app.get('/api/count/visitors', async (req, res) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 62)
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
app.get('/api/count/purchases', async (req, res) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 62);
    let where = {
        createdAt: {
            [Sequelize.Op.gte]: thresholdDate
        },
    }
    if (req.query.asAdmin === 'false' || req.query.asAdmin === false) {
        where.userId = req.query.id
    }

    const sells = await Purchases.findAll({
        where,
        attributes: ['createdAt', 'purchasePrice'],
        order: [['createdAt', 'DESC']]
    });
    res.send(sells)
})
app.get('/api/count/sells', async (req, res) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 62);
    let where = {
        createdAt: {
            [Sequelize.Op.gte]: thresholdDate
        },
    }
    if (req.query.asAdmin === 'false' || req.query.asAdmin === false) {
        where.userId = req.query.id
    }
    const sells = await Sells.findAll({
        where,
        attributes: ['createdAt', 'sellingPrice'],
        order: [['createdAt', 'DESC']]
    });
    res.send(sells)
})
app.get('/api/count/materials/top-materials', async (req, res) => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    let where = {
        createdAt: {
            [Sequelize.Op.gte]: lastMonth,
            [Sequelize.Op.lt]: today,
        },
    }
    if (req.query.asAdmin === 'false' || req.query.asAdmin === false) {
        where.user_id = req.query.id
    }
    const sells = await materials.findAll({
        attributes: ['name', 'totalSells'],
        order: [[Sequelize.col('totalSells'), 'DESC']],
        limit: 10,
        where
    });
    const purchased = await materials.findAll({
        attributes: ['name', 'totalPurchases'],
        order: [[Sequelize.col('totalPurchases'), 'DESC']],
        limit: 10,
        where,
    });
    res.send({ sells, purchased })
})
app.get('/api/count/user', async (req, res) => {

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 62);
    let where = {
        createdAt: {
            [Sequelize.Op.gte]: thresholdDate
        },
    }
    if (req.params.asAdmin === 'false' || req.params.asAdmin === false) {
        where.user_id = req.params.id
    }
    const users = await User.findAll({
        where,
        attributes: ['createdAt'],
        order: [['createdAt', 'DESC']]
    });
    res.send(users)
})

app.listen(process.env.PORT, () => console.log(`Listening on port http://127.0.0.1:${process.env.PORT}`))
