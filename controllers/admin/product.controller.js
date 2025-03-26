const Product = require("../../models/product.model")

// [GET] /admin/products
module.exports.index = async (req, res) => {

    let filterStatus = [
        {
            name: "Tat Ca",
            status: "",
            class: ""
        },
        {
            name: "Hoat Dong",
            status: "active",
            class: ""
        },
        {
            name: "Dung Hoat Dong",
            status: "inactive",
            class: ""
        }
    ]

    if(req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status)
        filterStatus[index].class = "active"
    }else {
        const index = filterStatus.findIndex(item => item.status == "")
        filterStatus[index].class = "active"
    }

    let find = {
        deleted: false
    }

    if(req.query.status) {
        find.status = req.query.status
    }

    const products = await Product.find(find)
    
    res.render("admin/pages/products/index", {
        pageTitle: "Trang san pham",
        products: products,
        filterStatus: filterStatus
    })
}

