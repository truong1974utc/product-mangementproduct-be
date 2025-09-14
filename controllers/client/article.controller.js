const Article = require("../../models/article.model")
const ProductCategory = require("../../models/product-category.model")
const productsCategoryHelper = require("../../helpers/products-category")

// [GET] /articles
module.exports.index = async (req, res) => {

    const articles = await Article.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"});
    
    res.render("client/pages/articles/index", {
        pageTitle: "Trang bài viết",
        articles: articles
    })
}

// [GET] /articles/detail/:slugArticle
module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            slug: req.params.slugArticle,
            status: "active"
        }
    
        const article = await Article.findOne(find)

        if(article.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: article.product_category_id,
                deleted: false,
                status: "active"
            })

            article.category = category
        }
    
        res.render("client/pages/articles/detail", {
            pageTitle: article.title,
            article: article
        })
    } catch (error) {
        res.redirect(`/articles`)
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        deleted: false,
        status: "active"
    })

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id)

    const listSubCategoryId = listSubCategory.map(item => item.id)

    const articles = await Article.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        deleted: false
    }).sort({ position: "desc"})

    res.render("client/pages/articles/index", {
        pageTitle: category.title,
        articles: articles
    })
}