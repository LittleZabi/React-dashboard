import Sequelize from 'sequelize'

export const sequelize = new Sequelize({
    dialect: 'mysql', // or another dialect like 'postgres', 'sqlite'
    host: 'localhost',
    username: 'root',
    password: '',
    database: '__conDB',
});

