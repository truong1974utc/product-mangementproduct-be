const md5 = require('md5');
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const Role = require("../../models/role.model")


// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Trang danh sách",
        records: records
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })

    if (emailExist) {
        req.flash("error", "Email đã tồn tại !")
        res.redirect("back")
    } else {
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

// [GET] /admin/accounts/detail:id
module.exports.detail = async (req, res) => {
    try {
        let find = {
            deleted: false,
            _id: req.params.id
        }

        const records = await Account.findOne(find).select("-password -token");

        const role = await Role.findOne({
            _id: records.role_id,
            deleted: false
        })
        records.role = role

        res.render("admin/pages/accounts/detail", {
            pageTitle: "Trang chi tiết tài khoản",
            records: records
        })

    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// // [GET] /admin/accounts/edit/:id
// module.exports.edit = async (req, res) => {
//     try {
//         let find = {
//             deleted: false,
//             _id: req.params.id
//         }

//         const records = await Account.findOne(find).select("-password -token");

//         const role = await Role.findOne({
//             _id: records.role_id,
//             deleted: false
//         })
//         records.role = role

//         const roles = await Role.find({
//             deleted: false
//         })

//         res.render("admin/pages/accounts/edit", {
//             pageTitle: "Sửa tài khoản",
//             records: records,
//             roles: roles
//         })

//     } catch (error) {
//         res.redirect(`${systemConfig.prefixAdmin}/accounts`)
//     }
// }

// [PATCH] /admin/accounts/edit/:id
// module.exports.editPatch = async (req, res) => {
//     const id = req.params.id

//     try {
//         await Account.updateOne({ _id: id }, req.body)
//         req.flash("success", `Cập nhật thành công !`)
//     } catch (error) {
//         req.flash("error", `Cập nhật thất bại !`)
//     }
//     res.redirect("back")
// }

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id

    // await Product.deleteOne({_id: id})
    await Account.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() })
    req.flash("success", ` Đã xóa thành công sản phẩm !`)

    res.redirect("back")
}