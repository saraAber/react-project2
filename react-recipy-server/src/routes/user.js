const express = require('express');
const route = express.Router();
const user = require('../controls/user');

route.post('/login', user.Login)
route.post('/sighin', user.Sighin)

module.exports = route;