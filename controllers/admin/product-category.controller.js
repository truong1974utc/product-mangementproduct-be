const ProductCategory = require("../../models/product-category.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

const systemConfig = require("../../config/system")

const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/products-category
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query)

    let find = {
        deleted: false,
    };

    if(req.query.status) {
        find.status = req.query.status
    }

    const objectSearch = searchHelper(req.query)
    if(objectSearch.regex) {
        find.title = objectSearch.regex
    }

    //Pagination
    const countProducts = await ProductCategory.countDocuments(find)
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4  
        },
        req.query,
        countProducts
    )
    // End Pagination

    // Sort
    let sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    }else {
        sort.position = "desc"
    }
    // End Sort

    const records = await ProductCategory.find(find)
    
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id;
    
    await ProductCategory.updateOne({_id: id}, { status: status})

    req.flash("success", "Cập nhật trạng thái thành công");

    res.redirect("back")

}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ")

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: {$in: ids}}, {status: "active"})
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: {$in: ids}}, {status: "inactive"})
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
            break;
        case "delete-all":
            await ProductCategory.updateMany({_id: {$in: ids}}, {deleted: true, deletedAt: new Date()})
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm !`)
            break;
        case "change-position":
            for(const item of ids){
                let[id, position] = item.split("-");
                position = parseInt(position)
                await ProductCategory.updateOne({_id: id}, {position: position})
                req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm !`)
            }
            break;    
        default:
            break;
    }

    res.redirect("back")
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id

    // await ProductCategory.deleteOne({_id: id})
    await ProductCategory.updateOne({_id: id}, {deleted: true, deletedAt: new Date()})

    req.flash("success", `Đã xóa thành công sản phẩm !`)

    res.redirect("back")
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {

    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records);

    console.log(newRecords)

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    })
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    if(req.body.position == "") {
            const count = await ProductCategory.countDocuments()
            req.body.position = count + 1
        } else {
            req.body.position = parseInt(req.body.position)
        }

    const record = new ProductCategory(req.body)
    await record.save()

    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    // try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
    
        const data = await ProductCategory.findOne(find)

        const records = await ProductCategory.find({
            deleted: false
        })

        const newRecords = createTreeHelper.tree(records);
    
        res.render("admin/pages/products-category/edit", {
            pageTitle: "Sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        })
    // } catch (error) {
    //     res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    // }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id

    req.body.position = parseInt(req.body.position)

    try {
        await ProductCategory.updateOne({ _id: id}, req.body)
        req.flash("success", `Cập nhật thành công !`)
    } catch (error) {
        req.flash("error", `Cập nhật thất bại !`)
    }
    res.redirect("back")
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
    
        const record = await ProductCategory.findOne(find)
    
        res.render("admin/pages/products-category/detail", {
            pageTitle: "Sửa danh mục sản phẩm",
            record: record
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
}