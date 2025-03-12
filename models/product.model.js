const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        deleted: Boolean,
        position: Number
    }
);

const Product = mongoose.model('Product', productSchema, "products")

module.exports = Product;