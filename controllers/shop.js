const Product = require('../models/product');

exports.getProducts = async(req, res, next) => {
    try{
        const products = await Product.fetchAll();
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
      });
    }
    catch(err){
        console.error(err)
    }
};

exports.getProduct = async(req, res, next) => {
    try{
        const prodId = req.params.productId;
      // Product.findAll({ where: { id: prodId } })
      //   .then(products => {
      //     res.render('shop/product-detail', {
      //       product: products[0],
      //       pageTitle: products[0].title,
      //       path: '/products'
      //     });
      //   })
      //   .catch(err => console.log(err));
        const product = await Product.findById(prodId);
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    }
    catch(err){
        console.error(err);
    }
};

exports.getIndex = async(req, res, next) => {
    try{
      const products = await Product.fetchAll();
      res.render('shop/index', {
          prods: products,
          pageTitle: 'shop',
          path: '/'
    });
  }
  catch(err){
      console.error(err)
  }
};

exports.getCart = async(req, res, next) => {
    try{
        const cartItems = await req.user.getCartItems();
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartItems
        });
    }
    catch(err){
        console.error(err);
    }
};

exports.postCart = async(req, res, next) => {
    try{
        const prodId = req.body.productId;    
        const product = await Product.findById(prodId);

        const result = await req.user.addToCart(product);
        res.redirect('/cart');
    }
    catch(err){
        console.error(err);
    }

};

exports.postCartDeleteProduct = async(req, res, next) => {
    try{
        const prodId = req.body.productId;
        const result = await req.user.deleteCartItem(prodId);

        res.redirect('/cart');
    }
    catch(err){
        console.error(err);
    }
};

exports.postOrder = async(req, res, next) => {
    try{
        await req.user.addOrder();
        res.redirect('/orders');
    }
    catch(err){
        console.error(err);
    }
};

exports.getOrders = async(req, res, next) => {
    try{
        const orders = await req.user.getOrders();
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
        });
    }
    catch(err){
        console.error(err);
    }
};
