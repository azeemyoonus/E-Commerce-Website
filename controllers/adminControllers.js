var producthelper = require('../helpers/product-helpers');
const compress_images = require("compress-images");

exports.home = (req, res, next) => {

    producthelper.getProduct().then((products) => {
        res.render('admin/view-products', { products, admin: true })
    })
}

exports.addProduct_get = (req, res) => {
    res.render('admin/add-products');
}

exports.addProduct_post = async (req, res) => {


    producthelper.addProduct(req.body, (id) => {
        let image = req.files.product_photo;
        image.mv("./public/product-images/" + id + ".jpeg", (err) => {
            if (!err) console.log("no error")
            else console.log("error in photo :" + err)
        })
        res.redirect("/admin");
    });

}

exports.deleteProduct = (req, res) => {
    let id = req.query.id;
    producthelper.deleteProduct(id).then(() => {
        res.redirect('/admin')
    })

}

exports.editProduct_get = (req, res) => {
    let id = req.query.id;
    producthelper.getOneProduct(req.query.id).then((productDetails) => {
        res.render('admin/edit-product', { productDetails, id });
    })

}

exports.editProduct_post = (req, res) => {
    let id = req.query.id;

    producthelper.editProduct(req.body, id).then(() => {
        if (req.files.product_photo) {
            let image = req.files.product_photo;
            image.mv("./public/product-images/" + id + ".jpeg")
        }
        res.redirect('/admin')
    })
}