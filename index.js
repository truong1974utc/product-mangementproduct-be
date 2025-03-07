const express = require('express')

const route = require("./routes/client/index.route")
require('dotenv').config()

const app = express()
const port = process.env.PORT

app.set('views', './views')
app.set('view engine', 'pug')

// Routes
route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})