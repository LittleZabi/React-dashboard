import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./database.js";
import bcrypt from 'bcryptjs'

export const User = sequelize.define('User', {
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
});
export const Materials = sequelize.define('Materials', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'unit_price'
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

export const Purchases = sequelize.define('Purchases', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Materials,
      key: 'id'
    },
    field: 'material_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    field: 'user_id'
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
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'purchase_date'
  }
});

export const Sells = sequelize.define('Sells', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Materials,
      key: 'id'
    },
    field: 'material_id'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  soldDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

export const Visitor = sequelize.define('Visitor', {
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


Purchases.belongsTo(Materials);
Purchases.belongsTo(User);
Sells.belongsTo(Materials);

(async () => {
  try {
    console.log('sycning....')
    await sequelize.sync();
    console.log('success sync')
  } catch (e) { console.log('eeror whiel sycncing...', e) }
})()

