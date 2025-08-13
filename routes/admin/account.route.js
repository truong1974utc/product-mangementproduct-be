const express = require("express")
const multer = require('multer')
const route = express.Router()

const upload = multer()

const controller = require("../../controllers/admin/account.controller")

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const validate = require("../../validates/admin/account.validate")


route.get("/", controller.index)

route.get("/create", controller.create)

route.post("/create",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
)



module.exports = route