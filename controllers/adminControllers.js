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


    // INPUT_path_to_your_images,
    //     OUTPUT_path;
    // INPUT_path_to_your_images = "src/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
    // OUTPUT_path = "build/img/";



    producthelper.addProduct(req.body, (id) => {
        let image = req.files.product_photo;
        image.mv("./public/product-images/" + id + ".jpeg", (err) => {
            if (!err) {
                console.log("no error");
                compress_images("./public/product-images/" + id + ".jpeg", "./public/product-images/" + id + ".jpg", { compress_force: false, statistic: true, autoupdate: true }, false,
                { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                // { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                // { svg: { engine: "svgo", command: "--multipass" } },
                // { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
                function (error, completed, statistic) {
                    // console.log("-------------");
                    // console.log(error);
                    // console.log(completed);
                    // console.log(statistic);
                    // console.log("-------------");
                }
            );
            res.redirect("/admin");
            
            }
            else console.log("error in photo :" + err)
        })
        
       

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