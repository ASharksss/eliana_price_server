const {Product, Basket, Order, ListOrder} = require('../models/models')
const reader = require('xlsx')
const {transporter, EMAIL_USER, SEND_ORDER_HTML} = require("../utils");
const file = reader.readFile('files/Order.xlsx')
const templateWorkbook = reader.readFile('files/customerCard.xlsx')

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
      const user = req.user
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

      let filtered = order.order.map(obj => {
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

      const wsCustomerCard = templateWorkbook.Sheets[templateWorkbook.SheetNames[0]];

      const customerData = {
        '@shortName': user.short_name,
        '@address': user.address,
        '@telephone': user.telephone,
        '@email': user.email,
        '@formOrg': formOrg,
        '@nameOrg': nameOrg,
        '@orderDate': new Date().toLocaleDateString()
      };

      function replaceAliases(sheet, data) {
        const range = reader.utils.decode_range(sheet['!ref']);
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const cellAddress = reader.utils.encode_cell({r: rowNum, c: colNum});
            const cell = sheet[cellAddress];
            if (cell && typeof cell.v === 'string') {
              for (const alias in data) {
                if (cell.v.includes(alias)) {
                  cell.v = cell.v.replace(alias, data[alias]);
                }
              }
            }
          }
        }
      }

// Замена алиасов на данные в карточке заказчика
      replaceAliases(wsCustomerCard, customerData);
      const customerCardWorkbook = reader.utils.book_new();
      reader.utils.book_append_sheet(customerCardWorkbook, wsCustomerCard, 'Карточка заказчика');

      const ordersArray = filtered.map(order => [order.name, order.count, order.price]);
      ordersArray.unshift(['Продукт', 'Количество', 'Сумма']);

      const wsOrdersData = reader.utils.aoa_to_sheet(ordersArray);
      reader.utils.book_append_sheet(file, wsOrdersData, `Заказ-${orderItem.id}`);

      const mergedWorkbook = reader.utils.book_new();
      reader.utils.book_append_sheet(mergedWorkbook, wsCustomerCard, 'Карточка заказчика');
      reader.utils.book_append_sheet(mergedWorkbook, wsOrdersData, 'Заказы');

      // const ws = reader.utils.json_to_sheet(filtered)
      // reader.utils.book_append_sheet(file, ws, `Заказ-${orderItem.id}`)
      await reader.writeFileAsync(`./files/Заказ-${orderItem.id}.xlsx`, mergedWorkbook, {}, async () => {
        const mailOptions = {
          from: EMAIL_USER,
          to: user.email,
          subject: 'Ваш заказ',
          html: SEND_ORDER_HTML(orderItem.id, user.short_name),
          attachments: [{
            path: `./files/Заказ-${orderItem.id}.xlsx`,
            filename: `Заказ ${user.short_name}.xlsx`,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }]
        };
        await transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        const mailOptionsAdmin = {
          from: EMAIL_USER,
          to: "four.and.one@yandex.ru",
          subject: `Заказ-${orderItem.id} для ${user.short_name}`,
          attachments: [{
            path: `./files/Заказ-${orderItem.id}.xlsx`,
            filename: `Заказ ${user.short_name}.xlsx`,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }]
        };
        await transporter.sendMail(mailOptionsAdmin, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      })
      return res.json(orderItem)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new ProductController()