const {Product, Basket, Order, ListOrder} = require('../models/models')
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

  async deleteInBasket(req, res) {
    try {
      const userId = req.userId
      const {productVendorCode} = req.body
      console.log(productVendorCode)
      const item = await Basket.destroy({where: {productVendorCode, userId}})
      return res.json(item)
    } catch (e) {
      return console.log(e)
    }
  }

  async deleteAllInBasket(req, res) {
    try {
      const userId = req.userId
      await Basket.destroy({where: {userId}})
      return res.json('Удалено')
    } catch (e) {
      return console.log(e)
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

  async getOrders(req, res) {
    try {
      const userId = req.userId
      const orders = await Order.findAll({where: {userId}})
      return res.json(orders)
    } catch (e) {
      return console.log(e.message)
    }
  }

  async getOrderList(req, res) {
    try {
      const {id} = req.params
      const orderList = await ListOrder.findAll({
        where: {orderId: id},
        include: Product
      })
      return res.json(orderList)
    } catch (e) {
      return console.log(e.message)
    }
  }

  async copyOrder(req, res) {
    try {
      const {list} = req.body
      const userId = req.userId
      const basket = await Basket.findAll({where: {userId}})
      if (basket.length > 0) return res.json(false)
      list.map(async item => {
        await Basket.create({count: item.count, userId, productVendorCode: item.product.vendor_code})
      })
      return res.json(true)
    } catch (e) {
      return console.log(e.message)
    }
  }

  async sendExcel(req, res) {
    try {
      const userId = req.userId
      const {order} = req.body
      const {formOrg, nameOrg, generalCount} = order

      let count = 0
      let sum = 0
      order.order.map(item => {
        count += item.count
        sum += item.price
      })
      const orderItem = await Order.create({userId, count, sum, count_box: generalCount, formOrg, nameOrg})
      order.order.map(async item => {
        await ListOrder.create({
          count: item.count,
          price: item.price,
          orderId: orderItem.id,
          productVendorCode: item.product.vendor_code
        })
        await Basket.destroy({where: {userId, productVendorCode: item.product.vendor_code}})
      })


      /*let filtered = order.order.map(obj => {
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
      reader.writeFile(file, './Tutorial.xlsx')*/
      return res.json(orderItem)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new ProductController()