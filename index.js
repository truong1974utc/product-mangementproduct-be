const express = require('express')
const path = require('path');
const methodOverride = require('method-override')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("express-flash")
const multer = require('multer')
require('dotenv').config()

const database = require("./config/database")

const systemConfig = require("./config/system")

const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")

database.connect()

const app = express()
const port = process.env.PORT

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

// Flash
app.use(cookieParser('NGUYENQUANGTRUONG'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static(`${__dirname}/public`))

// Routes
route(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})