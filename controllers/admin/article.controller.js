const Account = require("../../models/account.model")
const ProductCategory = require("../../models/product-category.model")
const Article = require("../../models/article.model")
const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/aricles
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query)

    let find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status
    }

    const objectSearch = searchHelper(req.query)
        if (objectSearch.regex) {
            find.title = objectSearch.regex
        }

    //Pagination
    const countArticles = await Article.countDocuments(find)

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countArticles
    )

    // End Pagination

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"
    }
    // End Sort

    const articles = await Article.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    res.render("admin/pages/articles/index", {
        pageTitle: "Trang bài viết",
        articles: articles,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        filterStatus: filterStatus,
    })
}

// [PATCH] /admin/aricles/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ")
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Article.updateMany({ _id: { $in: ids } }, {
                status: "active",
                $push: { updatedBy: updatedBy} 
            })
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} bài viết !`)
            break;
        case "inactive":
            await Article.updateMany({ _id: { $in: ids } }, { 
                status: "inactive",
                $push: { updatedBy: updatedBy} 
            })
            req.flash("success", ` Cập nhật trạng thái thành công ${ids.length} bài viết !`)
            break;
        case "delete-all":
            await Article.updateMany({ _id: { $in: ids } }, { deleted: true, deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            } })
            req.flash("success", ` Đã xóa thành công ${ids.length} bài viết !`)
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position)
                await Article.updateOne({ _id: id }, { 
                    position: position,
                    $push: { updatedBy: updatedBy}
                })
                req.flash("success", ` Đã đổi vị trí thành công ${ids.length} bài viết !`)
            }
            break;
        default:
            break;
    }

    res.redirect("back")
}

// [GET] /admin/aricles/create
module.exports.create = async (req, res) => {

    let find = {
        deleted: false
    }

    const category = await ProductCategory.find(find)

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/articles/create", {
        pageTitle: "Thêm mới bài viết",
        category: newCategory
    })
}

// [POST] /admin/aricles/create
module.exports.createPost = async (req, res) => {

    req.body.stock = parseInt(req.body.stock)

    if (req.body.position == "") {
        const countProducts = await Article.countDocuments()
        req.body.position = countProducts + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const article = new Article(req.body)
    await article.save()

    res.redirect(`${systemConfig.prefixAdmin}/articles`)
}

// [PATCH] /admin/aricles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Article.updateOne({ _id: id }, { 
        status: status,
        $push: { updatedBy: updatedBy}
    })

    req.flash("success", "Cập nhật trạng thái thành công");

    res.redirect("back")
}

// [GET] /admin/articles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const article = await Article.findOne(find)

        res.render("admin/pages/articles/detail", {
            pageTitle: "Chi tiết bài viết",
            article: article
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/articles`)
    }
}

// [GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const article = await Article.findOne(find)

        const category = await ProductCategory.find({
            deleted: false
        })

        const newCategory = createTreeHelper.tree(category);

        res.render("admin/pages/articles/edit", {
            pageTitle: "Sửa bài viết",
            article: article,
            category: newCategory
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/articles`)
    }
}

// [PATCH] /admin/articles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    req.body.position = parseInt(req.body.position)

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Article.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy}
        })
        req.flash("success", ` Cập nhật thành công !`)
    } catch (error) {
        req.flash("error", ` Cập nhật thất bại !`)
    }
    res.redirect("back")
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id

    await Article.updateOne({ _id: id }, {
        deleted: true, 
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })
    req.flash("success", ` Đã xóa bài viết thành công !`)

    res.redirect("back")
}