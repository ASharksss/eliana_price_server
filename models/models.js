const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Product = sequelize.define('product', {
  vendor_code: {type: DataTypes.STRING, primaryKey: true},
  name: {type: DataTypes.STRING},
  price_opt: {type: DataTypes.INTEGER},
  price_roz: {type: DataTypes.INTEGER},
})

const Brand = sequelize.define('brand', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const Category = sequelize.define('category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  short_name: {type: DataTypes.STRING},
  INN: {type: DataTypes.STRING},
  address: {type: DataTypes.STRING},
  telephone: {type: DataTypes.STRING},
  email: {type: DataTypes.STRING},
  password: {type: DataTypes.STRING}
})

const TypeUser = sequelize.define('type_user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const Basket = sequelize.define('basket', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count: {type: DataTypes.INTEGER}
})

const Order = sequelize.define('order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count: {type: DataTypes.INTEGER},
  sum: {type: DataTypes.INTEGER}
})

//Relationships

Brand.hasMany(Product)
Product.belongsTo(Brand)

Category.hasMany(Product)
Product.belongsTo(Category)

TypeUser.hasMany(User)
User.belongsTo(TypeUser)

Product.hasMany(Basket)
Basket.belongsTo(Product)

User.hasMany(Basket)
Basket.belongsTo(User)

Product.hasMany(Order)
Order.belongsTo(Product)

User.hasMany(Order)
Order.belongsTo(User)

module.exports = {
  Product, Category, User, TypeUser, Brand, Basket, Order
}