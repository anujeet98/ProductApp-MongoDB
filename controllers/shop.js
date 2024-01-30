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

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
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

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
