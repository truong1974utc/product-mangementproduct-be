const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phảm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(3)

    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
    // End Lấy ra sản phẩm nổi bật

    // Hiển thị danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc"}).limit(6);

    const newProductsNew = productsHelper.priceNewProducts(productsNew)
    // End Hiển thị danh sách sản phẩm mới nhất

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
}