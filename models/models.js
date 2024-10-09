const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Product = sequelize.define('product', {
  vendor_code: {type: DataTypes.STRING, primaryKey: true},
  name: {type: DataTypes.STRING},
  price_opt: {type: DataTypes.INTEGER},
  price_roz: {type: DataTypes.INTEGER},
  barcode: {type: DataTypes.INTEGER},
  count_in_box: {type: DataTypes.INTEGER},
  weight_in_box: {type: DataTypes.FLOAT},
  volume_in_box: {type: DataTypes.FLOAT},
  image: {type: DataTypes.STRING},
  description: {type: DataTypes.TEXT}
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
  count: {type: DataTypes.INTEGER},
  price: {type: DataTypes.INTEGER, defaultValue: 0}
})

const Order = sequelize.define('order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count: {type: DataTypes.INTEGER},
  sum: {type: DataTypes.INTEGER},
  count_box: {type: DataTypes.INTEGER},
  formOrg: {type: DataTypes.STRING},
  nameOrg: {type: DataTypes.STRING},
  howToDeliver: {type: DataTypes.STRING},
  address: {type: DataTypes.STRING},
  recipientFormOrg: {type: DataTypes.STRING},
  recipientNameOrg: {type: DataTypes.STRING},
  transportCompany: {type: DataTypes.STRING}
})

const ListOrder = sequelize.define('order_list', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count: {type: DataTypes.INTEGER},
  price: {type: DataTypes.INTEGER, defaultValue: 0}
})

const Company = sequelize.define('status_order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  formOrg: {type: DataTypes.STRING}
})


const Transport_company = sequelize.define('transport_company', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const Field_name = sequelize.define('field_name', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  type: {type: DataTypes.STRING}
})

const Field_options = sequelize.define('field_options', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const Transport_company_field = sequelize.define('transport_company_field', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const Waybills = sequelize.define('waybills', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  fieldName: {type: DataTypes.STRING},
  textValue: {type: DataTypes.STRING},
})

const Product_photo = sequelize.define('product_photo', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  photo: {type: DataTypes.STRING}
})

const StatusOrder = sequelize.define('status_order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

//Relationships
Product.hasMany(Product_photo)
Product_photo.belongsTo(Product)


Transport_company.hasMany(Waybills)
Waybills.belongsTo(Transport_company)

Order.hasMany(Waybills)
Waybills.belongsTo(Order)

Transport_company.hasMany(Transport_company_field)
Transport_company_field.belongsTo(Transport_company)

Field_name.hasMany(Transport_company_field)
Transport_company_field.belongsTo(Field_name)

Field_name.hasMany(Field_options)
Field_options.belongsTo(Field_name)

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

Order.hasMany(ListOrder)
ListOrder.belongsTo(Order)

Product.hasMany(ListOrder)
ListOrder.belongsTo(Product)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Company)
Company.belongsTo(User)

module.exports = {
  Product,
  Category,
  User,
  TypeUser,
  Brand,
  Basket,
  Order,
  ListOrder,
  Transport_company,
  Field_options,
  Field_name,
  Transport_company_field,
  Waybills,
  Product_photo
}