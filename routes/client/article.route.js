const express = require("express")
const route = express.Router();
const controller = require("../../controllers/client/article.controller")

route.get('/', controller.index)

route.get('/:slugCategory', controller.category)

route.get('/detail/:slugArticle', controller.detail)

module.exports = route;