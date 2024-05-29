const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {User} = require("./models/models");

const HTML_REGISTRATION = (email, phone, short_name) => `<!DOCTYPE html>
<html>
<head>
<style>
    body {
        font-family: Arial, sans-serif;
    }
    .header {
        background-color: #f1f1f1;
        padding: 20px;
        text-align: center;
    }
    .container {
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #ddd;
        margin-top: 20px;
    }
    .button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
    }
</style>
</head>
<body>

<div class="header">
    <h1>Добро пожаловать!</h1>
</div>

<div class="container">
    <h2>Приветсвуем ${short_name}, на нашем сайте!</h2>
    <p>Вас зарегистрировали на сайте <a href="https://vezdesens.ru/">название сайта</a></p>
    <p>Ваша почта для входа: ${email}</p>
    <p>Ваш номер телефона для связи: ${phone}</p>
</div>

</body>
</html>`
const SEND_ORDER_HTML = (orderId, short_name) => `<!DOCTYPE html>
<html>
<head>
<style>
    body {
        font-family: Arial, sans-serif;
    }
    .header {
        background-color: #f1f1f1;
        padding: 20px;
        text-align: center;
    }
    .container {
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #ddd;
        margin-top: 20px;
    }
    .button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
    }
</style>
</head>
<body>

<div class="header">
    <h1>Добрый день!</h1>
</div>

<div class="container">
    <h2>Приветсвуем ${short_name}!</h2>
    <p>Ваш заказ взят в сборку и ожидает оплаты</p>
    <p>Можете посмотреть у нас на <a href="http://192.168.1.121:3000/orderList/${orderId}">сайте</a></p>
    <p>Так же прикрепили excel файл для вашего удобства :)</p>
</div>

</body>
</html>`

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  host: 'smtp.beget.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

const generateTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      {user},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );
    const refreshToken = jwt.sign(
      {user},
      process.env.JWT_REFRESH_SECRET,
      {expiresIn: "30d"}
    );
    return {accessToken, refreshToken}
  } catch (err) {
    return Promise.reject(err);
  }
};

const refreshToken = async (oldToken) => {
  try {
    const decodeToken = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findByPk(decodeToken.user.id)
    if (!user) {
      throw Error('Пользователь не найден')
    }
    const {accessToken, refreshToken} = await generateTokens(user)
    return {accessToken, refreshToken};
  } catch (e) {
    throw Error('Неправильный токен')
  }
}

module.exports = {
  generateTokens, refreshToken, transporter,
  HTML_REGISTRATION, SEND_ORDER_HTML, EMAIL_USER
}