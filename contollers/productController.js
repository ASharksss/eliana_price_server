const {Product, Basket} = require('../models/models')
const reader = require('xlsx')
const file = reader.readFile('contollers/Tutorial.xlsx')

class ProductController {

  async createProduct(req, res, next) {
    try {
      const {vendor_code, name, categoryId, price_opt, price_roz, brandId} = req.body
      const product =
        await Product.create({vendor_code, name, categoryId, price_opt, price_roz, brandId})
      return res.json(product)
    } catch (e) {
      return e
    }
  }

  async getAll(req, res) {
    try {
      const {categoryId} = req.query
      const products = await Product.findAll({where: {categoryId}})
      return res.json(products)
    } catch (e) {
      return e
    }
  }

  async addInBasket(req, res) {
    try {
      const userId = req.userId
      const {productVendorCode, count} = req.body
      const [item, created] = await Basket.findOrCreate({where: {productVendorCode, userId}, defaults: {count: 0}})
      return res.json(created)
    } catch (e) {
      return e
    }
  }

  async getBasket(req, res) {
    try {
      const userId = req.userId
      const basket = await Basket.findAll({
        where: {userId},
        include: Product,
        order: [[{model: Product, as: 'Product'}, 'name', 'ASC']]
      })
      return res.json(basket)
    } catch (e) {
      return e
    }
  }

  async updateCountBasket(req, res) {
    try {
      const userId = req.userId
      const {productVendorCode, count} = req.body
      const newItem = await Basket.update({count}, {where: {productVendorCode, userId}})
      return res.json(newItem)
    } catch (e) {
      return e
    }
  }

  async updatePriceBasketItem(req, res) {
    try {
      const userId = req.userId
      const {productVendorCode, price} = req.body
      const newItem = await Basket.update({price}, {where: {productVendorCode, userId}})
      return res.json(newItem)
    } catch (e) {
      return e
    }
  }

  async sendExcel(req, res) {
    try {
      const {order} = req.body
      let filtered = order.map(obj => {
        const {
          id,
          product,
          updatedAt,
          createdAt,
          userId,
          productVendorCode,
          ...rest
        } = obj;
        rest['name'] = product.name
        return {...rest};
      });
      const ws = reader.utils.json_to_sheet(filtered)
      reader.utils.book_append_sheet(file, ws, "Sheet4")
      reader.writeFile(file, './Tutorial.xlsx')
      return res.json('вроде ок')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new ProductController()