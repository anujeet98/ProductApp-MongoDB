const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/product');
const Order = require('../models/order');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true},
            }
        ],
    }
});

UserSchema.methods.addToCart = function (product){
    try{
        const cartItems = this.cart.items;

        const cartProductIndex = cartItems.findIndex(cp => cp.productId.toString() === product._id.toString());

        if(cartProductIndex !== -1){
            cartItems[cartProductIndex].quantity++;
        }
        else{
            cartItems.push({productId: product._id, quantity: 1});
        }

        return this.save();
    }
    catch(err){
        console.error(err);
    }
}

UserSchema.methods.deleteCartItem = function(prodId){
    try{
        const updatedItems = this.cart.items.filter(item => item.productId._id.toString() !== prodId.toString());
        this.cart.items = updatedItems;
        return this.save();
    }   
    catch(err){
        console.error(err);
    }
}

UserSchema.methods.addOrder = function(){
    try{
        cartProducts = this.cart.items.map(item => {
            return{
                quantity: item.quantity,
                title: item.productId.title
            };
        });
        const order = new Order({products: cartProducts, userId: this._id});
        this.cart.items = [];
        return Promise.all([
            order.save(),
            this.save()
        ]);
    }
    catch(err){
        console.error(err);
    }
}

module.exports = mongoose.model('User', UserSchema);

