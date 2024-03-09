import { configDotenv } from "dotenv";
import { Materials, Purchases, Sells, User, Visitor } from "./libs/models.js";
import express from "express";
import { sequelize } from "./libs/database.js";
import { Sequelize } from "sequelize";
import cors from 'cors';
configDotenv()
const app = express();

app.use(cors({
    origin: 'http://localhost:5173' // Replace with your React app's origin
}));

// (() => {
//     for (let i = 10; i > -1; i--) {
//         let date = new Date(new Date().getTime() - (86400000 * i)).toISOString()
//         let turn = Math.ceil(Math.random() * 1200) + 900
//         for (let t = 0; t < turn; t++) {
//             console.log(t)
//         }
//     }
// })()

// (async () => {
//     // const sales = await Sells.findAll();
//     for (let i = 30; i > -1; i--) {
//         let date = new Date(new Date().getTime() - (86400000 * i)).toISOString()
//         let turn = Math.ceil(Math.random() * 100) + 40
//         for (let t = 0; t < turn; t++) {
//             let unique = Math.ceil(Math.random() * 2)
//             let ipAdr = `1${t}.1${(t * 0.3).toFixed(0)}.${t}${t * 4}`;
//             const sql = `INSERT INTO visitors 
//         (ipAddress, userAgent, createdAt, totalVisits) VALUES('${ipAdr}', 'Mozila Firefox/2', '${date}', ${unique})`;
//             // const sql = `INSERT INTO visitors 
//             // (ipAddress, userAgent, createdAt) VALUES('${ipAdr}', 'Mozila Firefox/2', 
//             // DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * DATEDIFF(CURDATE(), '2021-12-01') + 1) DAY)
//             // + INTERVAL FLOOR(RAND() * 24) HOUR
//             // + INTERVAL FLOOR(RAND() * 60) MINUTE
//             // + INTERVAL FLOOR(RAND() * 60) SECOND)`;
//             // // Execute the UPDATE query
//             await sequelize.query(sql);
//             // break
//         }
//         // break
//     }
// })()


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
