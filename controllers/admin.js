const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async(req, res, next) => {
  try{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const prod = new Product({ title: title, price: price, imageUrl: imageUrl, description: description});
    await prod.save();  
    res.redirect('/admin/products');
  }
  catch(err){
    console.log(err);
  }
};

exports.getEditProduct = async(req, res, next) => {
    try{
        const editMode = req.query.edit;
        if (!editMode) {
            return res.redirect('/');
        }
        const prodId = req.params.productId;
        const product = await Product.findById(prodId);
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
    }
    catch(err){
        console.error(err);
    }

};

exports.postEditProduct = async(req, res, next) => {
    try{
        const prodId = req.body.productId;
        const updatedTitle = req.body.title;
        const updatedPrice = req.body.price;
        const updatedImageUrl = req.body.imageUrl;
        const updatedDesc = req.body.description;
        const updatedProduct = new Product({title: updatedTitle, price: updatedPrice, imageUrl: updatedImageUrl, description: updatedDesc});

        const product = await Product.findById(prodId);
        if(product){
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;

            await product.save();
        }
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
    }
    catch(err){
        console.error(err);
    }
};

exports.getProducts = async(req, res, next) => {
  try{
      const products = await Product.find();
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
  }
  catch(err){
    console.error(err)
  }
};

exports.postDeleteProduct = async(req, res, next) => {
    try{
        const prodId = req.body.productId;
        await Product.findByIdAndDelete(prodId);
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    }
    catch(err){
        console.error(err);
    }
};
