const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { sequelize } = require("./database.js");
const bcrypt = require('bcryptjs');

const User = sequelize.define('users', {
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
const Materials = sequelize.define('materials', {
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
  totalSells: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalPurchases: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
    if (!material.parentId)
      material.parentId = null;
  }
});
User.hasMany(Materials, { foreignKey: 'user_id' }); // A user can have many materials
Materials.belongsTo(User, { foreignKey: 'user_id' }); // A material belongs to one user
const Purchases = sequelize.define('purchases', {
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

const Sells = sequelize.define('sells', {
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

const Visitor = sequelize.define('visitor', {
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

Sells.belongsTo(Materials, { foreignKey: 'materialId' });
Purchases.belongsTo(Materials);
Purchases.belongsTo(User, { foreignKey: 'userId' });
Sells.belongsTo(Materials);
Sells.belongsTo(User, { foreignKey: 'userId' });

(async () => {
  try {
    console.log('sycning....')
    await sequelize.sync();
    console.log('success sync')
  } catch (e) { console.log('eeror whiel sycncing...', e) }
})()

module.exports = { User, Materials, Purchases, Sells, Visitor };