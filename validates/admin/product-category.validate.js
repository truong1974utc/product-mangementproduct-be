module.exports.createPost =  (req, res, next) => {
    if(!req.body.title) {
        req.flash("error", "Vui long nhap tieu de ! ")
        res.redirect("back")
        return;
    }

    // if(req.body.title.length < 8) {
    //     req.flash("error", "Vui long nhap tieu de it nhat 8 ki tu ! ")
    //     res.redirect("back")
    //     return;
    // }

    next()
}