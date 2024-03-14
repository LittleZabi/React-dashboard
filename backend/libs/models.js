const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { sequelize } = require("./database.js");
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  avatar: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set(value) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(value, salt);
      this.setDataValue('password', hash);
    }
  },
  asAdmin: { type: DataTypes.BOOLEAN, default: false },
  sellings: {
    type: DataTypes.INTEGER,
    default: 0
  },
  purchases: {
    type: DataTypes.INTEGER,
    default: 0
  },
});
const Materials = sequelize.define('Materials', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    field: 'user_id'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    onUpdate: 'CURRENT_TIMESTAMP',
    field: 'updated_at'
  }
});
Materials.belongsTo(Materials, { as: 'parent' });
Materials.hasMany(Materials, { as: 'children', foreignKey: 'parentId' });
Materials.beforeCreate((material, options) => {
  if (!material.hasOwnProperty('parentId')) {
    material.parentId = null;
  }
});
User.hasMany(Materials, { foreignKey: 'user_id' }); // A user can have many materials
Materials.belongsTo(User, { foreignKey: 'user_id' }); // A material belongs to one user
const Purchases = sequelize.define('Purchases', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'purchase_price'
  },
});

const Sells = sequelize.define('Sells', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
});

const Visitor = sequelize.define('Visitor', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ipAddress: {
    type: Sequelize.STRING,
    allowNull: false
  },
  totalVisits: {
    type: Sequelize.INTEGER,
    default: 1
  },
  userAgent: {
    type: Sequelize.STRING,
    allowNull: false
  },
});


Sells.belongsTo(Materials); // A sell belongs to one material 
Purchases.belongsTo(Materials);
Purchases.belongsTo(User);
Sells.belongsTo(Materials);
Sells.belongsTo(User);

(async () => {
  try {
    console.log('sycning....')
    await sequelize.sync();
    console.log('success sync')
  } catch (e) { console.log('eeror whiel sycncing...', e) }
})()

module.exports = { User, Materials, Purchases, Sells, Visitor };