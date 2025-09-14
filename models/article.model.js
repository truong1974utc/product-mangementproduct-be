const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const articleSchema = new mongoose.Schema(
    {
        title: String,
        product_category_id: {
            type: String,
            default: ""
        },
        description: String,
        thumbnail: String,
        status: String,
        featured: String,
        deleted: {
            type: Boolean,
            default: false
        },
        position: Number,
        slug: { 
            type: String, 
            slug: "title",
            unique: true 
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deletedBy: {
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [
            {
                account_id: String,
                updatedAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
);

const Article = mongoose.model('Article', articleSchema, "articles")

module.exports = Article;